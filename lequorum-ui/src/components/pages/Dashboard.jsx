import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Button,
    Spinner,
    SimpleGrid
} from '@chakra-ui/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import * as pollApi from '$/clients/pollClient.js';
import { useAuth } from '$/contexts/AuthContext.jsx';
import { toaster } from '$components/ui/AppToaster.jsx';
import { queryKeys } from '$/common/constants.js';
import { formatDate } from '$/common/utils/datetime.util.js';
import { stateColor, stateLabel, pollShareUrl } from '$/common/utils/poll.util.js';
import useFetch from '$/hooks/useFetch.js';
import useMutate from '$/hooks/useMutate.js';
import ErrorState from '$components/ui/ErrorState.jsx';

const PollCard = ({ poll }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const deleteMutation = useMutate(pollApi.deletePoll, {
        mutationKey: ['deletePoll'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.polls.all });
            toaster.create({ title: 'Poll deleted', type: 'info', duration: 2000 });
        }
    });

    const state =
        poll.state ??
        (poll.isPublished
            ? 'published'
            : Date.now() > Date.parse(poll.expiresAt)
              ? 'expired'
              : 'active');

    const copyLink = () => {
        navigator.clipboard.writeText(pollShareUrl(poll.id));
        toaster.create({ title: 'Link copied!', type: 'success', duration: 1500 });
    };

    return (
        <Box
            bg="white"
            borderRadius="16px"
            border="1px solid"
            borderColor="#E7E5E0"
            p={5}
            transition="box-shadow 0.2s ease"
            _hover={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
        >
            <HStack justify="space-between" mb={2}>
                <Badge colorPalette={stateColor(state)} size="sm">
                    {stateLabel(state)}
                </Badge>
                {poll.isAnonymous && (
                    <Badge variant="subtle" colorPalette="gray" size="sm">
                        Anon
                    </Badge>
                )}
            </HStack>

            <Text fontWeight="600" mb={1} lineClamp={2}>
                {poll.title}
            </Text>
            <Text fontSize="xs" color="#78716C" mb={4}>
                {state === 'active' ? 'Ends' : 'Ended'} {formatDate(poll.expiresAt)}
            </Text>

            <VStack gap={2} align="stretch">
                <HStack>
                    <Link
                        to="/polls/$pollId/analytics"
                        params={{ pollId: poll.id }}
                        style={{ flex: 1 }}
                    >
                        <Button size="sm" variant="outline" w="100%" borderColor="#E7E5E0">
                            Analytics
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={copyLink}
                        flex={1}
                        borderColor="#E7E5E0"
                    >
                        Share link
                    </Button>
                </HStack>
                <Button
                    size="sm"
                    variant="ghost"
                    color="#B85450"
                    _hover={{ bg: '#FFF0EF' }}
                    loading={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(poll.id)}
                >
                    Delete
                </Button>
            </VStack>
        </Box>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const { data: polls, isLoading, isError } = useFetch(
        queryKeys.polls.all, 
        () => pollApi.getUserPolls(user.id)
    );

    if (isLoading)
        return (
            <Container maxW="900px" pt={20} textAlign="center">
                <Spinner color="#576F6A" />
            </Container>
        );

    if (isError) return <ErrorState message="Failed to load your polls." />;

    return (
        <Container maxW="900px" py={10}>
            <HStack justify="space-between" mb={8}>
                <Box>
                    <Heading fontFamily="'DM Serif Display', serif" size="lg" mb={1}>
                        Your polls
                    </Heading>
                    <Text fontSize="sm" color="#78716C">
                        Hello, {user.username} — {polls.length} poll{polls.length !== 1 ? 's' : ''}{' '}
                        total
                    </Text>
                </Box>
                <Link to="/polls/create">
                    <Button colorPalette="cta">New poll</Button>
                </Link>
            </HStack>

            {polls.length === 0 && (
                <Box
                    textAlign="center"
                    py={20}
                    border="1px dashed"
                    borderColor="#E7E5E0"
                    borderRadius="16px"
                    bg="white"
                >
                    <Text fontSize="2xl" mb={3}>
                        🗳️
                    </Text>
                    <Text fontWeight="500" mb={1}>
                        No polls yet
                    </Text>
                    <Text fontSize="sm" color="#78716C" mb={5}>
                        Create your first poll to start gathering responses
                    </Text>
                    <Link to="/polls/create">
                        <Button colorPalette="cta" size="sm">
                            Create a poll
                        </Button>
                    </Link>
                </Box>
            )}

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
                {polls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} />
                ))}
            </SimpleGrid>
        </Container>
    );
};

export default Dashboard;
