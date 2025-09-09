'use client';

import { FlaskIcon } from '@/components/ui/flask';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TestInfoTableProps {
  questionCount: number;
  timeLimit?: number;
  attempts: number;
  averageScore: number;
  difficulty: string;
}

const formatTime = (minutes?: number) => {
  if (!minutes) return 'No time limit';
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export function TestInfoTable({ 
  questionCount, 
  timeLimit, 
  attempts, 
  averageScore,
  difficulty
}: TestInfoTableProps) {
  const infoData = [
    {
      label: 'Questions',
      value: questionCount.toString(),
      icon: '📝'
    },
    {
      label: 'Time Limit',
      value: formatTime(timeLimit),
      icon: '⏱️'
    },
    {
      label: 'Difficulty',
      value: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      icon: '🎯'
    },
    {
      label: 'Attempts',
      value: attempts.toString(),
      icon: '🔄'
    },
    {
      label: 'Average Score',
      value: attempts > 0 ? `${averageScore.toFixed(1)}%` : 'N/A',
      icon: '📊'
    }
  ];

  return (
    <Card className="mb-6 rounded-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskIcon className="h-5 w-5" />
          Test Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {infoData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {item.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
