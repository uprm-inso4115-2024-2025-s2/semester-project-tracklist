import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform, 
    TouchableWithoutFeedback, 
    Keyboard, 
    StyleSheet 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

// Validation schema
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const SignInScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        setLoading(true);
        console.log('Login Data:', data);

        setTimeout(() => {
            setLoading(false);
            navigation.navigate('Home');
        }, 2000);
    };

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS !== "web" ? (
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        {renderForm({ control, errors, handleSubmit, onSubmit, loading })}
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            ) : (
                renderForm({ control, errors, handleSubmit, onSubmit, loading })
            )}
        </View>
    );
};

const renderForm = ({ control, errors, handleSubmit, onSubmit, loading }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>

        {/* Email Input */}
        <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </>
            )}
        />

        {/* Password Input */}
        <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                </>
            )}
        />

        {/* Submit Button */}
        <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit(onSubmit)} 
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.buttonText}>Login</Text>
            )}
        </TouchableOpacity>
    </View>
);

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignInScreen;
