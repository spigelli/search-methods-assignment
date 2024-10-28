import { z } from "zod";
import { geneticAlgorithmDataSchema } from "./page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function ScheduleTable({
  schedule,
}: {
  schedule: z.infer<typeof geneticAlgorithmDataSchema>["ending_schedule"];
}) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Fitness By Generation</CardTitle>
        <CardDescription>
          The averages for all schedules in the population for each generation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Activity</TableCell>
              <TableCell>Enrollment</TableCell>
              <TableCell>Facilitator</TableCell>
              <TableCell>Room</TableCell>
              <TableCell className="text-right">Time</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.activity}</TableCell>
                <TableCell>{row.enrollment}</TableCell>
                <TableCell>{row.facilitator}</TableCell>
                <TableCell>{row.room}</TableCell>
                <TableCell className="text-right">{row.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}