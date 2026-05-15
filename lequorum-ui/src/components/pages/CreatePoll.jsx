import {
    Box, Container, Heading, Text, VStack, HStack,
    Input, Button
} from '@chakra-ui/react';
import { Field, Switch } from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import QuestionBuilder from '$components/forms/QuestionBuilder.jsx';
import { createPoll } from '$/clients/pollClient.js';
import { toaster } from '$components/ui/AppToaster.jsx';
import { queryKeys } from '$/common/constants.js';
import useMutate from '$/hooks/useMutate.js';

const sectionStyle = {
    bg: 'white',
    borderRadius: '16px',
    border: '1px solid',
    borderColor: '#E7E5E0',
    p: 6
};

const emptyQuestion = () => ({
    text: '',
    isMandatory: true,
    options: [{ text: '' }, { text: '' }]
});

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [isAnon, setIsAnon] = useState(false);
    const [expiresAt, setExpiresAt] = useState('');
    const [questions, setQuestions] = useState([emptyQuestion()]);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutate(createPoll, {
        mutationKey: ['createPoll'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.polls.all });
            toaster.create({ title: 'Poll created!', type: 'success', duration: 2000 });
            navigate({ to: '/' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        for (const question of questions) {
            if (!question.text.trim() || question.options.some((option) => !option.text.trim())) return;
        }
        mutation.mutate({
            title: title.trim(),
            isAnonymous: isAnon,
            expiresAt: new Date(expiresAt).toISOString(),
            questions: questions.map((question, questionIndex) => ({
                text: question.text.trim(),
                isMandatory: question.isMandatory,
                order: questionIndex,
                options: question.options.map((option, optionIndex) => ({
                    text: option.text.trim(),
                    order: optionIndex
                }))
            }))
        });
    };

    return (
        <Container maxW="680px" py={10}>
            <Link to="/">
                <Text fontSize="sm" color="#78716C" mb={8} display="block" cursor="pointer"
                    _hover={{ color: '#576F6A' }}>
                    ← Back
                </Text>
            </Link>

            <Heading fontFamily="'DM Serif Display', serif" size="lg" mb={1}>
                Create a poll
            </Heading>
            <Text fontSize="sm" color="#78716C" mb={8}>
                Add questions, set an expiry, and share the link.
            </Text>

            <form onSubmit={handleSubmit}>
                <VStack gap={5} align="stretch">
                    <Box {...sectionStyle}>
                        <Text fontWeight="600" mb={4} fontSize="sm" color="#78716C"
                            textTransform="uppercase" letterSpacing="0.08em">
                            Poll details
                        </Text>
                        <VStack gap={4} align="stretch">
                            <Field.Root required>
                                <Field.Label fontSize="sm" color="#78716C">Title</Field.Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="What's this poll about?"
                                    maxLength={100}
                                    borderColor="#E7E5E0"
                                    borderRadius="10px"
                                    _focus={{ borderColor: '#576F6A', boxShadow: '0 0 0 1px #576F6A' }}
                                />
                            </Field.Root>

                            <HStack justify="space-between" align="center">
                                <Box>
                                    <Text fontSize="sm" fontWeight="500">Anonymous responses</Text>
                                    <Text fontSize="xs" color="#78716C">Respondents don't need to log in</Text>
                                </Box>
                                <Switch.Root
                                    checked={isAnon}
                                    onCheckedChange={(e) => setIsAnon(e.checked)}
                                    colorPalette="brand"
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch.Root>
                            </HStack>

                            <Field.Root required>
                                <Field.Label fontSize="sm" color="#78716C">Closes at</Field.Label>
                                <Input
                                    type="datetime-local"
                                    value={expiresAt}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    borderColor="#E7E5E0"
                                    borderRadius="10px"
                                    _focus={{ borderColor: '#576F6A', boxShadow: '0 0 0 1px #576F6A' }}
                                />
                            </Field.Root>
                        </VStack>
                    </Box>

                    <Box {...sectionStyle}>
                        <Text fontWeight="600" mb={4} fontSize="sm" color="#78716C"
                            textTransform="uppercase" letterSpacing="0.08em">
                            Questions
                        </Text>
                        <QuestionBuilder questions={questions} setQuestions={setQuestions} />
                    </Box>

                    <HStack justify="flex-end" gap={3}>
                        <Link to="/">
                            <Button variant="outline" borderColor="#E7E5E0">Cancel</Button>
                        </Link>
                        <Button
                            type="submit"
                            colorPalette="cta"
                            loading={mutation.isPending}
                            loadingText="Creating…"
                        >
                            Create poll
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </Container>
    );
};

export default CreatePoll;
