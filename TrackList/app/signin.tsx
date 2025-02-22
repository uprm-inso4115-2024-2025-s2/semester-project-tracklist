import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

const SignInScreen = () => {
    const navigation = useNavigation();

    // Validation schema
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        console.log('Login Data:', data);
        navigation.navigate('Home'); // Redirect to Home Screen
    };

    return (
        <Container>
            <Title>Sign In</Title>
            
            {/* Email Input */}
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <Input
                            placeholder="Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                        />
                        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
                    </>
                )}
            />
            
            {/* Password Input */}
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <Input
                            placeholder="Password"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
                    </>
                )}
            />
            
            {/* Submit Button */}
            <Button onPress={handleSubmit(onSubmit)}>
                <ButtonText>Login</ButtonText>
            </Button>
        </Container>
    );
};

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const Input = styled.TextInput`
    width: 100%;
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fff;
`;

const ErrorText = styled.Text`
    color: red;
    font-size: 12px;
    margin-bottom: 10px;
`;

const Button = styled.TouchableOpacity`
    background-color: #007BFF;
    padding: 15px;
    border-radius: 8px;
    width: 100%;
    align-items: center;
`;

const ButtonText = styled.Text`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
`;

export default SignInScreen;
