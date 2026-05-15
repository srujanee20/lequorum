import {
    Box, Container, Heading, Text, VStack, HStack,
    Button, Spinner, Badge
} from '@chakra-ui/react';
import { RadioGroup } from '@chakra-ui/react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Clock, Lock, CheckCircle } from 'lucide-react';
import { getPollById } from '$/clients/pollClient.js';
import { submitResponse } from '$/clients/responseClient.js';
import { useAuth } from '$/contexts/AuthContext.jsx';
import { useSocket } from '$/contexts/SocketContext.jsx';
import LiveCounter from '$components/widgets/LiveCounter.jsx';
import { formatDate } from '$/common/utils/datetime.util.js';
import { stateColor } from '$/common/utils/poll.util.js';
import { SOCKET_EVENTS, queryKeys } from '$/common/constants.js';
import useFetch from '$/hooks/useFetch.js';
import useMutate from '$/hooks/useMutate.js';
import ErrorState from '$components/ui/ErrorState.jsx';

const PollView = () => {
    const { pollId } = useParams({ strict: false });
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const socketRef = useSocket();

    const { data: poll, isLoading, isError } = useFetch(
        queryKeys.polls.detail(pollId),
        () => getPollById(pollId),
        { enabled: !!pollId }
    );

    const respondMutation = useMutate(submitResponse, { mutationKey: ['submitResponse'] });

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (poll?.state === 'published') {
            navigate({ to: '/poll/$pollId/results', params: { pollId } });
        }
    }, [poll, navigate, pollId]);

    useEffect(() => {
        const socket = socketRef?.current;
        if (!socket || !pollId) return;
        socket.emit(SOCKET_EVENTS.JOIN_POLL, pollId);
        return () => socket.emit(SOCKET_EVENTS.LEAVE_POLL, pollId);
    }, [pollId, socketRef]);

    if (isLoading)
        return <Container maxW="680px" pt={20} textAlign="center"><Spinner color="#576F6A" /></Container>;

    if (isError) return <ErrorState message="We couldn't find this poll. It might have been deleted." />;

    if (poll.state === 'expired') {
        return (
            <Container maxW="680px" py={16} textAlign="center">
                <Center mb={4} color="#78716C">
                    <Clock size={48} />
                </Center>
                <Heading fontFamily="'DM Serif Display', serif" size="md" mb={2}>This poll has ended</Heading>
                <Text color="#78716C" fontSize="sm">
                    {poll.title} closed on {formatDate(poll.expiresAt)}
                </Text>
            </Container>
        );
    }

    if (!poll.isAnonymous && !isLoggedIn) {
        return (
            <Container maxW="500px" py={16} textAlign="center">
                <Center mb={4} color="#576F6A">
                    <Lock size={48} />
                </Center>
                <Heading fontFamily="'DM Serif Display', serif" size="md" mb={2}>Sign in to respond</Heading>
                <Text color="#78716C" fontSize="sm" mb={6}>This poll requires you to be logged in.</Text>
                <Button colorPalette="cta" onClick={() => navigate({ to: '/login' })}>Sign in</Button>
            </Container>
        );
    }

    if (submitted) {
        return (
            <Container maxW="500px" py={16} textAlign="center">
                <Center mb={4} color="#576F6A">
                    <CheckCircle size={48} />
                </Center>
                <Heading fontFamily="'DM Serif Display', serif" size="md" mb={2}>Response recorded</Heading>
                <Text color="#78716C" fontSize="sm">
                    Thank you for participating in <strong>{poll.title}</strong>.
                </Text>
            </Container>
        );
    }

    const mandatoryIds = poll.questions.filter((question) => question.isMandatory).map((question) => question.id);
    const allAnswered = mandatoryIds.every((id) => answers[id]);
    const isPollExpired = Date.now() > Date.parse(poll.expiresAt);

    const handleSubmit = () => {
        respondMutation.mutate({ pollId, answers }, { onSuccess: () => setSubmitted(true) });
    };

    return (
        <Container maxW="680px" py={10}>
            <Box mb={8}>
                <HStack mb={3} justify="space-between">
                    <Badge colorPalette={stateColor(poll.state)} size="sm">
                        {poll.isAnonymous ? 'Anonymous poll' : 'Authenticated poll'}
                    </Badge>
                    <LiveCounter pollId={pollId} initialCount={0} />
                </HStack>
                <Heading fontFamily="'DM Serif Display', serif" size="lg" mb={1}>
                    {poll.title}
                </Heading>
                <Text fontSize="xs" color="#78716C">
                    By {poll.creator?.username} · Closes {formatDate(poll.expiresAt)}
                </Text>
            </Box>

            <VStack gap={4} align="stretch" mb={6}>
                {[...poll.questions]
                    .sort((questionA, questionB) => questionA.order - questionB.order)
                    .map((question) => (
                        <Box
                            key={question.id}
                            bg="white"
                            border="1px solid"
                            borderColor="#E7E5E0"
                            borderRadius="16px"
                            p={6}
                        >
                            <HStack mb={3}>
                                <Text fontWeight="500" fontSize="sm">{question.text}</Text>
                                {question.isMandatory && (
                                    <Text color="#C17C56" fontSize="xs" fontWeight="600">*</Text>
                                )}
                            </HStack>

                            <RadioGroup.Root
                                value={answers[question.id] || ''}
                                onValueChange={(e) =>
                                    setAnswers((prev) => ({ ...prev, [question.id]: e.value }))
                                }
                                colorPalette="brand"
                            >
                                <VStack align="stretch" gap={2}>
                                    {[...question.options]
                                        .sort((optionA, optionB) => optionA.order - optionB.order)
                                        .map((option) => (
                                            <Box
                                                key={option.id}
                                                px={3}
                                                py={2}
                                                borderRadius="10px"
                                                border="1px solid"
                                                borderColor={answers[question.id] === option.id ? '#576F6A' : '#E7E5E0'}
                                                bg={answers[question.id] === option.id ? '#EEF3F2' : 'transparent'}
                                                cursor="pointer"
                                                transition="all 0.1s"
                                                display="flex"
                                                alignItems="center"
                                                onClick={() =>
                                                    setAnswers((prev) => ({ ...prev, [question.id]: option.id }))
                                                }
                                            >
                                                <RadioGroup.Item value={option.id} w="100%" display="flex" alignItems="center" m={0}>
                                                    <RadioGroup.ItemHiddenInput />
                                                    <RadioGroup.ItemControl mr={2} />
                                                    <RadioGroup.ItemText fontSize="sm" mt="1px">{option.text}</RadioGroup.ItemText>
                                                </RadioGroup.Item>
                                            </Box>
                                        ))}
                                </VStack>
                            </RadioGroup.Root>
                        </Box>
                    ))}
            </VStack>

            <Box borderTopWidth="1px" borderColor="#E7E5E0" pt={5}>
                <HStack justify="flex-end" gap={3}>
                    <Text fontSize="xs" color="#78716C">* Required</Text>
                    <Button
                        colorPalette="cta"
                        disabled={!allAnswered || isPollExpired}
                        loading={respondMutation.isPending}
                        onClick={handleSubmit}
                    >
                        Submit response
                    </Button>
                </HStack>
            </Box>
        </Container>
    );
};

export default PollView;
