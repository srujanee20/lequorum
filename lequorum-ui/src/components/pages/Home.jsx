import { Box, Container, Heading, Text, VStack, HStack, Button, Spinner, SimpleGrid, Badge, Center } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Inbox } from 'lucide-react';
import { getActivePolls } from '$/clients/pollClient.js';
import { useAuth } from '$/contexts/AuthContext.jsx';
import { formatDate } from '$/common/utils/datetime.util.js';
import ErrorState from '$components/ui/ErrorState.jsx';

const Home = () => {
    const { isLoggedIn } = useAuth();
    const [polls, setPolls] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadPolls = async (pageToLoad) => {
        setLoading(true);
        try {
            const result = await getActivePolls(pageToLoad, 9);
            if (pageToLoad === 1) {
                setPolls(result.data);
            } else {
                setPolls((prev) => [...prev, ...result.data]);
            }
            setHasMore(pageToLoad < result.meta.totalPages);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPolls(1);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadPolls(nextPage);
    };

    return (
        <Box w="100%">
            {/* Hero Section */}
            <Box 
                bg="white" 
                borderBottom="1px solid" 
                borderColor="#E7E5E0" 
                py={{ base: 10, md: 16 }} 
                textAlign="center" 
                mb={10}
            >
                <Container maxW="800px">
                    <Heading 
                        fontFamily="'DM Serif Display', serif" 
                        fontSize={{ base: '3xl', md: '5xl' }} 
                        color="#1C1917"
                        mb={4}
                    >
                        Welcome to Lequorum
                    </Heading>
                    <Text 
                        fontSize="md" 
                        color="#78716C" 
                        mb={8} 
                        maxW="500px" 
                        mx="auto"
                    >
                        A platform for creating and participating in polls. Discover what others are asking, or start your own in seconds.
                    </Text>
                    
                    {!isLoggedIn ? (
                        <HStack justify="center" gap={3}>
                            <Link to="/register">
                                <Button 
                                    size="md" 
                                    bg="#576F6A" 
                                    color="white" 
                                    _hover={{ bg: '#425853' }}
                                >
                                    Get Started
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button 
                                    size="md" 
                                    variant="outline" 
                                    color="#1C1917" 
                                    borderColor="#E7E5E0" 
                                    _hover={{ bg: '#FAF9F6' }}
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </HStack>
                    ) : (
                        <Link to="/dashboard">
                            <Button 
                                size="md" 
                                bg="#576F6A" 
                                color="white" 
                                _hover={{ bg: '#425853' }}
                            >
                                Go to Dashboard →
                            </Button>
                        </Link>
                    )}
                </Container>
            </Box>

            {/* Polls Section */}
            <Container maxW="900px" pb={20}>
                <HStack justify="space-between" mb={8}>
                    <Heading fontFamily="'DM Serif Display', serif" size="lg">
                        Active Polls
                    </Heading>
                    {!isLoggedIn && (
                        <Text fontSize="sm" color="#78716C">Showing anonymous polls only</Text>
                    )}
                </HStack>

                {error && <ErrorState message="Failed to load active polls." />}

                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={5}>
                    {polls.map((poll) => (
                        <Link key={poll.id} to="/poll/$pollId" params={{ pollId: poll.id }} style={{ display: 'block' }}>
                            <Box
                                bg="white"
                                borderRadius="16px"
                                border="1px solid"
                                borderColor="#E7E5E0"
                                p={5}
                                h="100%"
                                transition="all 0.2s ease"
                                _hover={{ boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' }}
                            >
                                <HStack justify="space-between" mb={3}>
                                    <Badge colorPalette="green" size="sm">Active</Badge>
                                    {poll.isAnonymous && <Badge variant="subtle" colorPalette="gray" size="sm">Anon</Badge>}
                                </HStack>
                                <Text fontWeight="600" mb={2} lineClamp={3}>
                                    {poll.title}
                                </Text>
                                <Text fontSize="xs" color="#78716C" mt="auto">
                                    By {poll.creator?.username || 'Unknown'} · Ends {formatDate(poll.expiresAt)}
                                </Text>
                            </Box>
                        </Link>
                    ))}
                </SimpleGrid>

                {loading && polls.length === 0 && (
                    <Box textAlign="center" py={10}>
                        <Spinner color="#576F6A" />
                    </Box>
                )}

                {!loading && polls.length === 0 && !error && (
                    <Box textAlign="center" py={16} bg="white" borderRadius="16px" border="1px dashed" borderColor="#E7E5E0">
                    <Center mb={4} color="#78716C">
                        <Inbox size={48} />
                    </Center>
                        <Text fontWeight="500">No active polls found</Text>
                        <Text fontSize="sm" color="#78716C">Check back later for new polls.</Text>
                    </Box>
                )}

                {hasMore && polls.length > 0 && (
                    <Box textAlign="center" mt={10}>
                        <Button 
                            variant="outline" 
                            borderColor="#E7E5E0" 
                            onClick={handleLoadMore}
                            loading={loading}
                        >
                            Load More
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Home;
