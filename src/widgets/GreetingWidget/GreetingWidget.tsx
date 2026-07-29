import { GreetingMessage, type GreetingMessageProps } from "@/features/greeting";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared";

/**
 * features/greeting을 shared/ui(Card)로 감싼 위젯.
 * FSD 예시 슬라이스(#13): entities/greeting → features/greeting → widgets/GreetingWidget
 * 체인이 실제로 동작하고, ESLint 경계 규칙(#3)이 이 슬라이스에서도 정상 동작함을 보여준다.
 */
export function GreetingWidget({ hour }: GreetingMessageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>인사</CardTitle>
      </CardHeader>
      <CardContent>
        <GreetingMessage hour={hour} />
      </CardContent>
    </Card>
  );
}
