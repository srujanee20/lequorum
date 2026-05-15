import { Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

const NotFound = () => {
    return (
        <Container maxW="500px" textAlign="center" pt={24}>
            <VStack gap={4}>
                <Text
                    fontFamily="'DM Serif Display', serif"
                    fontSize="6xl"
                    lineHeight={1}
                    color="#E7E5E0"
                >
                    404
                </Text>
                <Heading fontFamily="'DM Serif Display', serif" size="md" color="#1C1917">
                    Page not found
                </Heading>
                <Text fontSize="sm" color="#78716C">
                    This page doesn't exist or has been moved.
                </Text>
                <Link to="/">
                    <Button colorPalette="cta" mt={2}>
                        Go home
                    </Button>
                </Link>
            </VStack>
        </Container>
    );
};

export default NotFound;
