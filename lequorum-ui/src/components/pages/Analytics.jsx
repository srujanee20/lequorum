import {
    Box, Container, Heading, Text, VStack, HStack,
    SimpleGrid, Button, Spinner, Badge
} from '@chakra-ui/react';
import { Stat } from '@chakra-ui/react';
import { useParams, Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toaster } from '$components/ui/AppToaster.jsx';
import AnalyticsChart from '$components/charts/AnalyticsChart.jsx';
import { formatDate } from '$/common/utils/datetime.util.js';
import { stateColor, stateLabel } from '$/common/utils/poll.util.js';
import { queryKeys } from '$/common/constants.js';
import { getPollById, publishPoll } from '$/clients/pollClient.js';
import { getAnalytics } from '$/clients/analyticsClient.js';
import useFetch from '$/hooks/useFetch.js';
import useMutate from '$/hooks/useMutate.js';
import useFeed from '$/hooks/useFeed.js';
import ErrorState from '$components/ui/ErrorState.jsx';

const CARD = {
    bg: 'white',
    borderRadius: '16px',
    border: '1px solid',
    borderColor: '#E7E5E0',
    p: 6
};

const STAT_CARD = {
    bg: 'white',
    borderRadius: '14px',
    border: '1px solid',
    borderColor: '#E7E5E0',
    p: 5
};

const Analytics = () => {
    const { pollId } = useParams({ strict: false });
    const queryClient = useQueryClient();

    const { data: poll, isError: isPollError } = useFetch(
        queryKeys.polls.detail(pollId),
        () => getPollById(pollId),
        { enabled: !!pollId }
    );

    const { data: analytics, isLoading, isError: isAnalyticsError } = useFeed(
        queryKeys.polls.analytics(pollId),
        () => getAnalytics(pollId),
        pollId
    );

    const publishMutation = useMutate(() => publishPoll(pollId), {
        mutationKey: ['publishPoll', pollId],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.polls.detail(pollId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.polls.all });
            toaster.create({ title: 'Results published!', type: 'success', duration: 2500 });
        }
    });

    const state = poll?.state;
    const canPublish = state === 'expired' && !poll?.isPublished;

    if (isLoading)
        return <Container maxW="900px" pt={20} textAlign="center"><Spinner color="#576F6A" /></Container>;

    if (isPollError || isAnalyticsError || (!isLoading && !analytics))
        return <ErrorState message="We couldn't load analytics for this poll." />;

    return (
        <Container maxW="900px" py={10}>
            <Link to="/">
                <Text fontSize="sm" color="#78716C" mb={2} display="block" cursor="pointer"
                    _hover={{ color: '#576F6A' }}>
                    ← Dashboard
                </Text>
            </Link>

            <HStack justify="space-between" align="flex-start" mb={8} flexWrap="wrap" gap={3}>
                <Box>
                    <HStack mb={2}>
                        {state && <Badge colorPalette={stateColor(state)} size="sm">{stateLabel(state)}</Badge>}
                        {poll?.isAnonymous && <Badge variant="subtle" colorPalette="gray" size="sm">Anonymous</Badge>}
                    </HStack>
                    <Heading fontFamily="'DM Serif Display', serif" size="lg" mb={1}>
                        {analytics.title}
                    </Heading>
                    {poll && (
                        <Text fontSize="xs" color="#78716C">
                            {state === 'active' ? 'Closes' : 'Closed'} {formatDate(poll.expiresAt)}
                        </Text>
                    )}
                </Box>

                {canPublish && (
                    <Button
                        colorPalette="cta"
                        loading={publishMutation.isPending}
                        onClick={() => publishMutation.mutate()}
                    >
                        Publish results
                    </Button>
                )}
                {poll?.isPublished && (
                    <Link to="/poll/$pollId/results" params={{ pollId }}>
                        <Button variant="outline" borderColor="#E7E5E0">View public results →</Button>
                    </Link>
                )}
            </HStack>

            <SimpleGrid columns={{ base: 2, md: 3 }} gap={4} mb={6}>
                <Box {...STAT_CARD}>
                    <Stat.Root>
                        <Stat.Label fontSize="xs" color="#78716C">Total responses</Stat.Label>
                        <Stat.ValueText fontSize="2xl" fontFamily="'DM Serif Display', serif">
                            {analytics.totalResponses}
                        </Stat.ValueText>
                    </Stat.Root>
                </Box>
                <Box {...STAT_CARD}>
                    <Stat.Root>
                        <Stat.Label fontSize="xs" color="#78716C">Questions</Stat.Label>
                        <Stat.ValueText fontSize="2xl" fontFamily="'DM Serif Display', serif">
                            {analytics.questions.length}
                        </Stat.ValueText>
                    </Stat.Root>
                </Box>
                <Box {...STAT_CARD}>
                    <Stat.Root>
                        <Stat.Label fontSize="xs" color="#78716C">Participation</Stat.Label>
                        <Stat.ValueText fontSize="lg" fontFamily="'DM Serif Display', serif">
                            {analytics.totalResponses > 0
                                ? `${analytics.totalResponses} response${analytics.totalResponses !== 1 ? 's' : ''}`
                                : 'None yet'}
                        </Stat.ValueText>
                    </Stat.Root>
                </Box>
            </SimpleGrid>

            <VStack gap={5} align="stretch">
                {analytics.questions.map((question) => (
                    <Box key={question.id} {...CARD}>
                        <AnalyticsChart question={question} />
                    </Box>
                ))}
            </VStack>

            {analytics.totalResponses === 0 && (
                <Box textAlign="center" py={10} color="#78716C">
                    <Text fontSize="2xl" mb={2}>📭</Text>
                    <Text fontSize="sm">No responses yet. Share the poll link to get started.</Text>
                    <Button
                        size="sm"
                        variant="outline"
                        mt={4}
                        borderColor="#E7E5E0"
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/poll/${pollId}`);
                            toaster.create({ title: 'Link copied!', type: 'success', duration: 1500 });
                        }}
                    >
                        Copy poll link
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default Analytics;
