import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { puzzleApi } from "../services/puzzleApi";

interface ExitButtonProps {
  gameId: string;
  sessionId: string;
  onExit?: () => void;
}

export const ExitButton = ({ gameId, sessionId, onExit }: ExitButtonProps) => {
  const navigate = useNavigate();

  const handleExit = async () => {
    try {
      // ⚠️ WAJIB: POST request untuk menambah play count
      // Finish dengan score 0 saat exit
      await puzzleApi.finishGame({
        gameId,
        sessionId,
        moveCount: 0,
        timeTaken: 0,
      });
    } catch (error) {
      console.error("Error finishing game:", error);
    } finally {
      onExit?.();
      navigate("/");
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={() => void handleExit()}
      className="flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <LogOut className="w-4 h-4" />
      Exit
    </Button>
  );
};
