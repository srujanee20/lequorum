import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useRouter } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ message = "We couldn't connect to our servers. Please try again later.", onRetry }) => {
    const router = useRouter();

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            router.invalidate();
        }
    };

    return (
        <Container maxW="600px" py={20}>
            <Box
                textAlign="center"
                py={16}
                px={6}
                bg="white"
                borderRadius="16px"
                border="1px solid"
                borderColor="#E7E5E0"
                boxShadow="0 4px 12px rgba(0,0,0,0.05)"
            >
                <VStack gap={4}>
                    <Box color="#B85450">
                        <AlertCircle size={48} />
                    </Box>
                    <Heading fontFamily="'DM Serif Display', serif" size="xl">
                        Oops! Something went wrong
                    </Heading>
                    <Text color="#78716C" fontSize="md" maxW="400px" textAlign="center">
                        {message}
                    </Text>
                    <Button mt={4} colorPalette="cta" onClick={handleRetry}>
                        Try again
                    </Button>
                </VStack>
            </Box>
        </Container>
    );
};

export default ErrorState;
