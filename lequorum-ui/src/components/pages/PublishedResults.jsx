import {
    Box, Container, Heading, Text, VStack,
    SimpleGrid, Badge, Spinner
} from '@chakra-ui/react';
import { Stat } from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';
import AnalyticsChart from '$components/charts/AnalyticsChart.jsx';
import { formatDate } from '$/common/utils/datetime.util.js';
import { queryKeys } from '$/common/constants.js';
import { getPollById } from '$/clients/pollClient.js';
import { getAnalytics } from '$/clients/analyticsClient.js';
import useFetch from '$/hooks/useFetch.js';
import useFeed from '$/hooks/useFeed.js';
import ErrorState from '$components/ui/ErrorState.jsx';

const CARD = {
    bg: 'white',
    borderRadius: '16px',
    border: '1px solid',
    borderColor: '#E7E5E0',
    p: 6
};

const PublishedResults = () => {
    const { pollId } = useParams({ strict: false });

    const { data: poll, isLoading: pollLoading, isError: isPollError } = useFetch(
        queryKeys.polls.detail(pollId),
        () => getPollById(pollId),
        { enabled: !!pollId }
    );

    const { data: analytics, isLoading: analyticsLoading, isError: isAnalyticsError } = useFeed(
        queryKeys.polls.analytics(pollId),
        () => getAnalytics(pollId),
        pollId
    );

    if (pollLoading || analyticsLoading)
        return <Container maxW="680px" pt={20} textAlign="center"><Spinner color="#576F6A" /></Container>;

    if (isPollError || isAnalyticsError)
        return <ErrorState message="We couldn't load the results for this poll." />;

    if (!poll?.isPublished)
        return (
            <Container maxW="680px" pt={16} textAlign="center">
                <Text color="#78716C" fontSize="sm">Results have not been published yet.</Text>
            </Container>
        );

    return (
        <Container maxW="680px" py={10}>
            <Badge colorPalette="purple" mb={4} size="sm">Final results</Badge>
            <Heading fontFamily="'DM Serif Display', serif" size="lg" mb={1}>
                {poll.title}
            </Heading>
            <Text fontSize="xs" color="#78716C" mb={8}>
                Closed {formatDate(poll.expiresAt)} · {analytics?.totalResponses ?? 0} total response{analytics?.totalResponses !== 1 ? 's' : ''}
            </Text>

            <SimpleGrid columns={2} gap={4} mb={6}>
                <Box {...CARD}>
                    <Stat.Root>
                        <Stat.Label fontSize="xs" color="#78716C">Responses</Stat.Label>
                        <Stat.ValueText fontFamily="'DM Serif Display', serif">
                            {analytics?.totalResponses ?? 0}
                        </Stat.ValueText>
                    </Stat.Root>
                </Box>
                <Box {...CARD}>
                    <Stat.Root>
                        <Stat.Label fontSize="xs" color="#78716C">Questions</Stat.Label>
                        <Stat.ValueText fontFamily="'DM Serif Display', serif">
                            {analytics?.questions?.length ?? 0}
                        </Stat.ValueText>
                    </Stat.Root>
                </Box>
            </SimpleGrid>

            <VStack gap={5} align="stretch">
                {analytics?.questions.map((question) => (
                    <Box key={question.id} {...CARD}>
                        <AnalyticsChart question={question} />
                    </Box>
                ))}
            </VStack>

            <Text fontSize="xs" color="#C5C2BB" textAlign="center" mt={8}>
                Powered by Lequorum
            </Text>
        </Container>
    );
};

export default PublishedResults;
