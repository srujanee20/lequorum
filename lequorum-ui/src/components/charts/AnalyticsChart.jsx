import { Box, Text, HStack } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CHART_COLORS = ['#576F6A', '#7AA89E', '#A5C4BF', '#C17C56', '#D49063', '#E4AB8D'];

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) 
      return null;
    
    const entry = payload[0].payload;
    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="#E7E5E0"
            borderRadius="8px"
            p={3}
            shadow="sm"
        >
            <Text fontSize="sm" fontWeight="500">
                {entry.name}
            </Text>
            <Text fontSize="sm" color="#78716C">
                {entry.count} vote{entry.count !== 1 ? 's' : ''} · {entry.percentage}%
            </Text>
        </Box>
    );
};

const AnalyticsChart = ({ question }) => {
    const data = question.options.map((option) => ({
        name: option.text,
        count: option.count,
        percentage: option.percentage
    }));

    const maxCount = Math.max(...data.map((d) => d.count), 0);
    const yTicks = maxCount <= 10 ? Array.from({ length: maxCount + 1 }, (_, i) => i) : undefined;

    return (
        <Box>
            <HStack justify="space-between" mb={3}>
                <Text fontWeight="500" fontSize="sm">
                    {question.text}
                </Text>
                <Text fontSize="xs" color="#78716C">
                    {question.totalAnswers} answer{question.totalAnswers !== 1 ? 's' : ''}
                </Text>
            </HStack>
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data} barSize={32} margin={{ left: -20 }}>
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: '#78716C' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#C5C2BB' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                        ticks={yTicks}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {data.map((_, colorIndex) => (
                            <Cell
                                key={colorIndex}
                                fill={CHART_COLORS[colorIndex % CHART_COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default AnalyticsChart;
