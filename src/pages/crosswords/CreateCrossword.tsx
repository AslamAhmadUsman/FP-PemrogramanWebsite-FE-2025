// src/pages/crosswords/CreateCrossword.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Save, RefreshCw, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {
  generateCrosswordLayout,
  WordInput,
  PlacedWord,
} from "./utils/generator";
import { ICrosswordGameData, ICrosswordCell } from "./types"; // Pastikan ICrosswordCell diimport

export default function CreateCrossword() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const [items, setItems] = useState<WordInput[]>([
    { answer: "", clue: "" },
    { answer: "", clue: "" },
  ]);

  const [generatedGrid, setGeneratedGrid] = useState<(string | null)[][]>([]);
  const [generatedClues, setGeneratedClues] = useState<PlacedWord[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleItemChange = (
    index: number,
    field: keyof WordInput,
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    setIsGenerated(false);
  };

  const addItem = () => setItems([...items, { answer: "", clue: "" }]);

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setIsGenerated(false);
  };

  const handleGenerate = () => {
    const validItems = items.filter(
      (i) => i.answer.trim() !== "" && i.clue.trim() !== "",
    );
    if (validItems.length < 2) {
      toast.error("Minimal masukkan 2 kata beserta clue-nya");
      return;
    }

    const { grid, placed } = generateCrosswordLayout(validItems);

    if (placed.length < validItems.length) {
      toast(
        `${validItems.length - placed.length} kata gagal masuk grid. Coba tambah kata penghubung!`,
        { icon: "⚠️" },
      );
    }

    setGeneratedGrid(grid);
    setGeneratedClues(placed);
    setIsGenerated(true);
  };

  const handleSave = async () => {
    if (!title) return toast.error("Judul wajib diisi");
    if (!isGenerated) return toast.error("Klik Generate terlebih dahulu");

    const rows = generatedGrid.length;
    if (rows === 0) return toast.error("Grid kosong, generate ulang!");

    const cols = generatedGrid[0]?.length || 0;

    // PERBAIKAN: Ganti any[] menjadi ICrosswordCell[]
    const cellsPayload: ICrosswordCell[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cellsPayload.push({
          x: c,
          y: r,
          is_black: generatedGrid[r][c] === null,
          value: generatedGrid[r][c] || undefined,
          number: generatedClues.find((w) => w.row === r && w.col === c)
            ?.number,
        });
      }
    }

    const cluesPayload = {
      across: generatedClues
        .filter((c) => c.direction === "across")
        .map((c) => ({
          number: c.number,
          question: c.clue,
          answer: c.answer,
          length: c.answer.length,
          start_x: c.col,
          start_y: c.row,
        })),
      down: generatedClues
        .filter((c) => c.direction === "down")
        .map((c) => ({
          number: c.number,
          question: c.clue,
          answer: c.answer,
          length: c.answer.length,
          start_x: c.col,
          start_y: c.row,
        })),
    };

    const finalPayload: ICrosswordGameData = {
      title,
      grid_rows: rows,
      grid_cols: cols,
      cells: cellsPayload,
      clues: cluesPayload,
    };

    console.log("DATA SIAP DIKIRIM KE BACKEND:", finalPayload);

    toast.success("Game berhasil dibuat! (Data tercetak di Console)");
    navigate("/my-projects");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b px-8 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/my-projects")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Typography variant="h4">Create Crossword</Typography>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={handleGenerate}>
            <RefreshCw className="mr-2 h-4 w-4" /> Generate Preview
          </Button>
          <Button onClick={handleSave} disabled={!isGenerated}>
            <Save className="mr-2 h-4 w-4" /> Save Game
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row p-8 gap-8 max-w-7xl mx-auto w-full">
        <Card className="w-full lg:w-1/2 h-fit border-slate-200">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Label>Game Title</Label>
                <Input
                  placeholder="e.g. Pengetahuan Umum"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Words & Clues</Label>
                  <Typography variant="muted" className="text-xs">
                    Min. 2 words
                  </Typography>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="grid gap-2 flex-1">
                      <Input
                        placeholder="Answer (e.g. MERAH)"
                        value={item.answer}
                        onChange={(e) =>
                          handleItemChange(
                            idx,
                            "answer",
                            e.target.value.toUpperCase(),
                          )
                        }
                      />
                      <Input
                        placeholder="Clue (e.g. Warna Bendera Indonesia)"
                        value={item.clue}
                        onChange={(e) =>
                          handleItemChange(idx, "clue", e.target.value)
                        }
                        className="text-sm text-muted-foreground"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 mt-1"
                      onClick={() => removeItem(idx)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed border-2"
                  onClick={addItem}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Word
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-1/2 bg-slate-100 min-h-[400px] border-slate-200">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            {!isGenerated ? (
              <div className="text-center text-muted-foreground">
                <RefreshCw className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <Typography variant="h4">Preview Area</Typography>
                <p>Add words and click "Generate Preview".</p>
              </div>
            ) : (
              <div className="w-full overflow-auto text-center">
                <Typography variant="h4" className="mb-4">
                  Result Preview
                </Typography>
                <div
                  className="grid gap-[1px] bg-slate-400 border border-slate-400 mx-auto w-fit shadow-lg"
                  style={{
                    gridTemplateColumns: `repeat(${generatedGrid.length > 0 ? generatedGrid[0].length : 0}, 28px)`,
                  }}
                >
                  {generatedGrid.map((row, r) =>
                    row.map((cell, c) => (
                      <div
                        key={`${r}-${c}`}
                        className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold select-none ${
                          cell ? "bg-white text-black" : "bg-slate-900"
                        }`}
                      >
                        {cell}
                      </div>
                    )),
                  )}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>
                    Grid Size: {generatedGrid.length}x{generatedGrid[0]?.length}
                  </p>
                  <p>
                    Words Placed: {generatedClues.length} /{" "}
                    {items.filter((i) => i.answer).length}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
