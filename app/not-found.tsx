import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <p className="text-8xl font-bold text-gradient sm:text-9xl">404</p>
        <p className="mt-4 text-xl font-semibold">
          페이지를 찾을 수 없습니다
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Button asChild className="btn-gradient mt-8 rounded-xl cursor-pointer">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </Button>
      </div>
    </div>
  );
}
