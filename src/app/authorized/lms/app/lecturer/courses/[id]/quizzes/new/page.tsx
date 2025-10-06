"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER"

interface Question {
  id: number
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: number | string
  explanation?: string
}

export default function NewQuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: "MULTIPLE_CHOICE",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ])

  const addQuestion = (type: QuestionType = "MULTIPLE_CHOICE") => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type,
      question: "",
      options: type === "MULTIPLE_CHOICE" ? ["", "", "", ""] : type === "TRUE_FALSE" ? ["Đúng", "Sai"] : [],
      correctAnswer: type === "SHORT_ANSWER" ? "" : 0,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const updateQuestionType = (id: number, type: QuestionType) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              type,
              options: type === "MULTIPLE_CHOICE" ? ["", "", "", ""] : type === "TRUE_FALSE" ? ["Đúng", "Sai"] : [],
              correctAnswer: type === "SHORT_ANSWER" ? "" : 0,
            }
          : q,
      ),
    )
  }

  const handleSave = () => {
    router.push(`/lecturer/courses/${params.id}/quizzes`)
  }

  return (
    <div className="flex flex-col">
      <Header title="Tạo bài kiểm tra mới" />

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tạo bài kiểm tra mới</h1>
              <p className="text-muted-foreground">Thiết lập câu hỏi và cài đặt</p>
            </div>

            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Lưu bài kiểm tra
            </Button>
          </div>

          {/* Quiz Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cài đặt bài kiểm tra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input id="title" placeholder="VD: Bài kiểm tra Module 1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" rows={3} placeholder="Mô tả về bài kiểm tra..." />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời gian (phút)</Label>
                  <Input id="duration" type="number" defaultValue="30" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passingScore">Điểm đạt (%)</Label>
                  <Input id="passingScore" type="number" defaultValue="70" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attempts">Số lần làm</Label>
                  <Input id="attempts" type="number" defaultValue="3" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <input type="checkbox" id="shuffleQuestions" className="h-4 w-4" defaultChecked />
                  <Label htmlFor="shuffleQuestions">Xáo trộn câu hỏi</Label>
                </div>

                <div className="flex items-center gap-4">
                  <input type="checkbox" id="showResults" className="h-4 w-4" defaultChecked />
                  <Label htmlFor="showResults">Hiển thị kết quả ngay sau khi làm</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Câu hỏi ({questions.length})</h2>
            <div className="flex gap-2">
              <Button onClick={() => addQuestion("MULTIPLE_CHOICE")} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Trắc nghiệm
              </Button>
              <Button onClick={() => addQuestion("TRUE_FALSE")} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Đúng/Sai
              </Button>
              <Button onClick={() => addQuestion("SHORT_ANSWER")} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Trả lời ngắn
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Câu hỏi {index + 1}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select
                        value={question.type}
                        onValueChange={(value) => updateQuestionType(question.id, value as QuestionType)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MULTIPLE_CHOICE">Trắc nghiệm</SelectItem>
                          <SelectItem value="TRUE_FALSE">Đúng/Sai</SelectItem>
                          <SelectItem value="SHORT_ANSWER">Trả lời ngắn</SelectItem>
                        </SelectContent>
                      </Select>
                      {questions.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nội dung câu hỏi</Label>
                    <Textarea placeholder="Nhập câu hỏi..." rows={2} />
                  </div>

                  {question.type === "MULTIPLE_CHOICE" && (
                    <div className="space-y-2">
                      <Label>Các đáp án</Label>
                      <RadioGroup defaultValue="0">
                        {question.options.map((_, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-3">
                            <RadioGroupItem value={optIndex.toString()} id={`q${question.id}-opt${optIndex}`} />
                            <Input placeholder={`Đáp án ${String.fromCharCode(65 + optIndex)}`} className="flex-1" />
                          </div>
                        ))}
                      </RadioGroup>
                      <p className="text-xs text-muted-foreground">Chọn radio button để đánh dấu đáp án đúng</p>
                    </div>
                  )}

                  {question.type === "TRUE_FALSE" && (
                    <div className="space-y-2">
                      <Label>Đáp án đúng</Label>
                      <RadioGroup defaultValue="0">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="0" id={`q${question.id}-true`} />
                          <Label htmlFor={`q${question.id}-true`}>Đúng</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="1" id={`q${question.id}-false`} />
                          <Label htmlFor={`q${question.id}-false`}>Sai</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {question.type === "SHORT_ANSWER" && (
                    <div className="space-y-2">
                      <Label>Đáp án mẫu</Label>
                      <Textarea placeholder="Nhập đáp án mẫu hoặc từ khóa cần có trong câu trả lời..." rows={2} />
                      <p className="text-xs text-muted-foreground">
                        Câu trả lời của học viên sẽ được so sánh với đáp án này
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Giải thích (tùy chọn)</Label>
                    <Textarea placeholder="Giải thích tại sao đáp án này đúng..." rows={2} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
