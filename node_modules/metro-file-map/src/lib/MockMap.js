"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _getMockName = _interopRequireDefault(require("../getMockName"));
var _RootPathUtils = require("./RootPathUtils");
var _nullthrows = _interopRequireDefault(require("nullthrows"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
class MockMap {
  #mocksPattern;
  #raw;
  #rootDir;
  #pathUtils;
  #console;
  #throwOnModuleCollision;
  constructor({
    console,
    mocksPattern,
    rawMockMap,
    rootDir,
    throwOnModuleCollision,
  }) {
    this.#mocksPattern = mocksPattern;
    this.#raw = rawMockMap ?? {
      mocks: new Map(),
      duplicates: new Map(),
    };
    this.#rootDir = rootDir;
    this.#console = console;
    this.#pathUtils = new _RootPathUtils.RootPathUtils(rootDir);
    this.#throwOnModuleCollision = throwOnModuleCollision;
  }
  getMockModule(name) {
    const mockPath =
      this.#raw.mocks.get(name) || this.#raw.mocks.get(name + "/index");
    if (typeof mockPath !== "string") {
      return null;
    }
    return this.#pathUtils.normalToAbsolute(mockPath);
  }
  onNewOrModifiedFile(absoluteFilePath) {
    if (!this.#mocksPattern.test(absoluteFilePath)) {
      return;
    }
    const mockName = (0, _getMockName.default)(absoluteFilePath);
    const existingMockPath = this.#raw.mocks.get(mockName);
    const newMockPath = this.#pathUtils.absoluteToNormal(absoluteFilePath);
    if (existingMockPath != null) {
      if (existingMockPath !== newMockPath) {
        let duplicates = this.#raw.duplicates.get(mockName);
        if (duplicates == null) {
          duplicates = new Set([existingMockPath, newMockPath]);
          this.#raw.duplicates.set(mockName, duplicates);
        } else {
          duplicates.add(newMockPath);
        }
        this.#console.warn(this.#getMessageForDuplicates(mockName, duplicates));
      }
    }
    this.#raw.mocks.set(mockName, newMockPath);
  }
  onRemovedFile(absoluteFilePath) {
    if (!this.#mocksPattern.test(absoluteFilePath)) {
      return;
    }
    const mockName = (0, _getMockName.default)(absoluteFilePath);
    const duplicates = this.#raw.duplicates.get(mockName);
    if (duplicates != null) {
      const relativePath = this.#pathUtils.absoluteToNormal(absoluteFilePath);
      duplicates.delete(relativePath);
      if (duplicates.size === 1) {
        this.#raw.duplicates.delete(mockName);
      }
      const remaining = (0, _nullthrows.default)(
        duplicates.values().next().value
      );
      this.#raw.mocks.set(mockName, remaining);
    } else {
      this.#raw.mocks.delete(mockName);
    }
  }
  getSerializableSnapshot() {
    return {
      mocks: new Map(this.#raw.mocks),
      duplicates: new Map(
        [...this.#raw.duplicates].map(([k, v]) => [k, new Set(v)])
      ),
    };
  }
  assertValid() {
    if (!this.#throwOnModuleCollision) {
      return;
    }
    const errors = [];
    for (const [mockName, relativePaths] of this.#raw.duplicates) {
      errors.push(this.#getMessageForDuplicates(mockName, relativePaths));
    }
    if (errors.length > 0) {
      throw new Error(
        `Mock map has ${errors.length} error${
          errors.length > 1 ? "s" : ""
        }:\n${errors.join("\n")}`
      );
    }
  }
  #getMessageForDuplicates(mockName, duplicates) {
    return (
      "Duplicate manual mock found for `" +
      mockName +
      "`:\n" +
      [...duplicates]
        .map(
          (relativePath) =>
            "    * <rootDir>" +
            _path.default.sep +
            this.#pathUtils.absoluteToNormal(relativePath) +
            "\n"
        )
        .join("")
    );
  }
}
exports.default = MockMap;
