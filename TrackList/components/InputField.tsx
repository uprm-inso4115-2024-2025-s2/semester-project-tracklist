// components/InputField.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InputFieldProps = TextInputProps & {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  inputType?: "text" | "password" | "email";
  errorMessage?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  inputType = "text",
  keyboardType,
  errorMessage,
  ...props
}) => {
  const [secureText, setSecureText] = useState(inputType === "password");

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={
            keyboardType
              ? keyboardType
              : inputType === "email"
              ? "email-address"
              : "default"
          }
          secureTextEntry={inputType === "password" && secureText}
          style={[
            styles.input,
            Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {},
            props.style,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {inputType === "password" && (
          <TouchableOpacity
            onPress={() => setSecureText((prev) => !prev)}
            style={{ marginLeft: 8 }}
          >
            <Ionicons
              name={secureText ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  inputContainerFocused: {
    borderColor: "#000",
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    ...(Platform.OS === "web" && {
      outlineStyle: "none",
      cursor: "text",
    }),
  },
  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});
