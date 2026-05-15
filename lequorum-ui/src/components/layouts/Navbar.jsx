import { Box, Container, HStack, Heading, Button, Text } from '@chakra-ui/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '$/contexts/AuthContext.jsx';

const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate({ to: '/login' });
    };

    return (
        <Box
            bg="white"
            borderBottom="1px solid"
            borderColor="#E7E5E0"
            py={4}
            position="sticky"
            top={0}
            zIndex={10}
        >
            <Container maxW="900px">
                <HStack justify="space-between">
                    <Link to="/">
                        <Heading
                            fontFamily="'DM Serif Display', serif"
                            size="md"
                            color="#1C1917"
                            cursor="pointer"
                        >
                            Lequorum
                        </Heading>
                    </Link>
                    <HStack gap={4}>
                        {isLoggedIn ? (
                            <>
                                <Text
                                    fontSize="sm"
                                    color="#78716C"
                                    display={{ base: 'none', sm: 'block' }}
                                >
                                    {user?.username}
                                </Text>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleLogout}
                                    color="#78716C"
                                >
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button size="sm" variant="ghost" color="#78716C">
                                        Sign in
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm" colorPalette="cta">
                                        Get started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </HStack>
                </HStack>
            </Container>
        </Box>
    );
};

export default Navbar;
