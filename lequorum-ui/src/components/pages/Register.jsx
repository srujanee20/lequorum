import { Box, Container, VStack, Heading, Text, Input, Button } from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { register as registerApi } from '$/clients/authClient.js';
import { useAuth } from '$/contexts/AuthContext.jsx';
import useMutate from '$/hooks/useMutate.js';

const cardStyle = {
    bg: 'white',
    p: 8,
    borderRadius: '20px',
    border: '1px solid',
    borderColor: '#E7E5E0',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    w: '100%',
    maxW: '400px'
};

const Register = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const mutation = useMutate(registerApi, {
        mutationKey: ['register'],
        onSuccess: ({ token, user }) => {
            login(token, user);
            navigate({ to: '/' });
        }
    });

    const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    return (
        <Container maxW="500px" pt={20}>
            <VStack gap={6}>
                <VStack gap={1} textAlign="center">
                    <Heading fontFamily="'DM Serif Display', serif" size="lg">
                        Create your account
                    </Heading>
                    <Text color="#78716C" fontSize="sm">
                        Start gathering opinions that matter
                    </Text>
                </VStack>

                <Box {...cardStyle}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            mutation.mutate(form);
                        }}
                    >
                        <VStack gap={4}>
                            <Field.Root required>
                                <Field.Label fontSize="sm" color="#78716C">
                                    Username
                                </Field.Label>
                                <Input
                                    value={form.username}
                                    onChange={setField('username')}
                                    placeholder="alphanumeric, 3–30 chars"
                                    borderColor="#E7E5E0"
                                    borderRadius="10px"
                                    _focus={{
                                        borderColor: '#576F6A',
                                        boxShadow: '0 0 0 1px #576F6A'
                                    }}
                                />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label fontSize="sm" color="#78716C">
                                    Password
                                </Field.Label>
                                <Input
                                    type="password"
                                    value={form.password}
                                    onChange={setField('password')}
                                    placeholder="min 6 characters"
                                    borderColor="#E7E5E0"
                                    borderRadius="10px"
                                    _focus={{
                                        borderColor: '#576F6A',
                                        boxShadow: '0 0 0 1px #576F6A'
                                    }}
                                />
                            </Field.Root>

                            <Button
                                type="submit"
                                w="100%"
                                colorPalette="cta"
                                loading={mutation.isPending}
                                mt={2}
                            >
                                Get started
                            </Button>
                        </VStack>
                    </form>
                </Box>

                <Text fontSize="sm" color="#78716C">
                    Already have an account?{' '}
                    <Link to="/login">
                        <Text as="span" color="#576F6A" fontWeight="500" cursor="pointer">
                            Sign in
                        </Text>
                    </Link>
                </Text>
            </VStack>
        </Container>
    );
};

export default Register;
