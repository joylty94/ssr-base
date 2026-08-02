import { Counter } from "@/features/counter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared";

/**
 * features/counter를 shared/ui(Card)로 감싼 위젯.
 * Zustand 상태 관리 예시 슬라이스: features/counter(model+ui) → widgets/CounterWidget.
 * greeting 체인과 마찬가지로 ESLint FSD 경계 규칙(#3)이 정상 동작함을 함께 보여준다.
 */
export function CounterWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>카운터</CardTitle>
        <CardDescription>Zustand 스토어로 상태를 관리하는 예시</CardDescription>
      </CardHeader>
      <CardContent>
        <Counter />
      </CardContent>
    </Card>
  );
}
