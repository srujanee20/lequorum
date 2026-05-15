import { VStack, HStack, Box, Text, Input, Button, IconButton } from '@chakra-ui/react';
import { Switch } from '@chakra-ui/react';

const emptyQuestion = (order) => ({
    text: '',
    isMandatory: true,
    order,
    options: [{ text: '' }, { text: '' }]
});

const QuestionBuilder = ({ questions, setQuestions }) => {
    const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion(prev.length)]);

    const removeQuestion = (questionIndex) =>
        setQuestions((prev) => prev.filter((_, index) => index !== questionIndex));

    const updateQuestion = (questionIndex, field, value) =>
        setQuestions((prev) =>
            prev.map((question, index) =>
                index === questionIndex ? { ...question, [field]: value } : question
            )
        );

    const addOption = (questionIndex) =>
        setQuestions((prev) =>
            prev.map((question, index) =>
                index === questionIndex
                    ? { ...question, options: [...question.options, { text: '' }] }
                    : question
            )
        );

    const removeOption = (questionIndex, optionIndex) =>
        setQuestions((prev) =>
            prev.map((question, index) =>
                index === questionIndex
                    ? {
                          ...question,
                          options: question.options.filter((_, opIdx) => opIdx !== optionIndex)
                      }
                    : question
            )
        );

    const updateOption = (questionIndex, optionIndex, value) =>
        setQuestions((prev) =>
            prev.map((question, index) =>
                index === questionIndex
                    ? {
                          ...question,
                          options: question.options.map((opt, opIdx) =>
                              opIdx === optionIndex ? { text: value } : opt
                          )
                      }
                    : question
            )
        );

    return (
        <VStack gap={4} align="stretch">
            {questions.map((question, questionIndex) => (
                <Box
                    key={questionIndex}
                    bg="white"
                    border="1px solid"
                    borderColor="#E7E5E0"
                    borderRadius="14px"
                    p={5}
                >
                    <HStack justify="space-between" mb={3}>
                        <Text fontSize="sm" fontWeight="500" color="#78716C">
                            Question {questionIndex + 1}
                        </Text>
                        <HStack gap={3}>
                            <HStack gap={2}>
                                <Text fontSize="xs" color="#78716C">
                                    Mandatory
                                </Text>
                                <Switch.Root
                                    checked={question.isMandatory}
                                    onCheckedChange={(e) =>
                                        updateQuestion(questionIndex, 'isMandatory', e.checked)
                                    }
                                    colorPalette="brand"
                                    size="sm"
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch.Root>
                            </HStack>

                            {questions.length > 1 && (
                                <IconButton
                                    size="xs"
                                    variant="ghost"
                                    aria-label="Remove question"
                                    color="#B85450"
                                    onClick={() => removeQuestion(questionIndex)}
                                >
                                    ✕
                                </IconButton>
                            )}
                        </HStack>
                    </HStack>

                    <Input
                        placeholder="Type your question…"
                        value={question.text}
                        onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                        mb={4}
                        bg="white"
                        borderColor="#E7E5E0"
                        borderRadius="10px"
                    />

                    <VStack gap={2} align="stretch" mb={3}>
                        {question.options.map((option, optionIndex) => (
                            <HStack key={optionIndex}>
                                <Box
                                    w="8px"
                                    h="8px"
                                    borderRadius="full"
                                    border="2px solid"
                                    borderColor="#C5C2BB"
                                    flexShrink={0}
                                />
                                <Input
                                    placeholder={`Option ${optionIndex + 1}`}
                                    value={option.text}
                                    onChange={(e) =>
                                        updateOption(questionIndex, optionIndex, e.target.value)
                                    }
                                    size="sm"
                                    bg="white"
                                    borderColor="#E7E5E0"
                                    borderRadius="8px"
                                />
                                {question.options.length > 2 && (
                                    <IconButton
                                        size="xs"
                                        variant="ghost"
                                        aria-label="Remove option"
                                        color="#B85450"
                                        onClick={() => removeOption(questionIndex, optionIndex)}
                                    >
                                        ✕
                                    </IconButton>
                                )}
                            </HStack>
                        ))}
                    </VStack>

                    <Button
                        size="xs"
                        variant="ghost"
                        color="#576F6A"
                        onClick={() => addOption(questionIndex)}
                    >
                        ＋ Add option
                    </Button>
                </Box>
            ))}

            <Button
                variant="outline"
                onClick={addQuestion}
                borderStyle="dashed"
                borderColor="#C5C2BB"
                color="#78716C"
                _hover={{ bg: 'white', borderColor: '#576F6A', color: '#576F6A' }}
            >
                ＋ Add question
            </Button>
        </VStack>
    );
};

export default QuestionBuilder;
