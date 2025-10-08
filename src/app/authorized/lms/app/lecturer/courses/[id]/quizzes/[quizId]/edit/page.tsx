"use client"

import { useState } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Textarea } from "@lms/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@lms/components/ui/radio-group"
import { Save, Plus, Trash2, GripVertical } from "lucide-react"

const initialQuestions = [
  {
    id: 1,
    question: "Python là ngôn ngữ lập trình gì?",
    options: ["Ngôn ngữ biên dịch", "Ngôn ngữ thông dịch", "Ngôn ngữ assembly", "Ngôn ngữ máy"],
    correctAnswer: 1,
    type: "MULTIPLE_CHOICE",
  },
  {
    id: 2,
    question: "Cú pháp nào sau đây đúng để khai báo biến trong Python?",
    options: ["int x = 5", "var x = 5", "x = 5", "let x = 5"],
    correctAnswer: 2,
    type: "MULTIPLE_CHOICE",
  },
]

export default function EditQuizPage({ params }: { params: { id: string; quizId: string } }) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [questionType, setQuestionType] = useState<"MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER">("MULTIPLE_CHOICE")

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      type: questionType,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <div className="flex flex-col">
      <Header title="Chỉnh sửa bài kiểm tra" />

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Chỉnh sửa bài kiểm tra</h1>
              <p className="text-muted-foreground">Cập nhật thông tin và câu hỏi</p>
            </div>

            <Button>
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
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
                <Input id="title" defaultValue="Bài kiểm tra Module 1" />
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

              <div className="flex items-center gap-4">
                <input type="checkbox" id="shuffleQuestions" className="h-4 w-4" defaultChecked />
                <Label htmlFor="shuffleQuestions">Xáo trộn câu hỏi</Label>
              </div>

              <div className="flex items-center gap-4">
                <input type="checkbox" id="showResults" className="h-4 w-4" defaultChecked />
                <Label htmlFor="showResults">Hiển thị kết quả ngay sau khi làm</Label>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Câu hỏi ({questions.length})</h2>
            <Button onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm câu hỏi
            </Button>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 cursor-move text-muted-foreground" />
                      <CardTitle className="text-lg">Câu hỏi {index + 1}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nội dung câu hỏi</Label>
                    <Textarea defaultValue={question.question} placeholder="Nhập câu hỏi..." rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label>Loại câu hỏi</Label>
                    <select
                      value={question.type}
                      onChange={(e) =>
                        setQuestions((prevQuestions) =>
                          prevQuestions.map((q) => (q.id === question.id ? { ...q, type: e.target.value as any } : q)),
                        )
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="MULTIPLE_CHOICE">Trắc nghiệm nhiều lựa chọn</option>
                      <option value="TRUE_FALSE">Đúng/Sai</option>
                      <option value="SHORT_ANSWER">Câu trả lời ngắn</option>
                    </select>
                  </div>

                  {question.type === "MULTIPLE_CHOICE" && (
                    <div className="space-y-2">
                      <Label>Các đáp án</Label>
                      <RadioGroup defaultValue={question.correctAnswer.toString()}>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-3">
                            <RadioGroupItem value={optIndex.toString()} id={`q${question.id}-opt${optIndex}`} />
                            <Input
                              defaultValue={option}
                              placeholder={`Đáp án ${String.fromCharCode(65 + optIndex)}`}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {question.type === "TRUE_FALSE" && (
                    <div className="space-y-2">
                      <Label>Đáp án đúng</Label>
                      <RadioGroup defaultValue="true">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="true">Đúng</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="false">Sai</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {question.type === "SHORT_ANSWER" && (
                    <div className="space-y-2">
                      <Label>Đáp án đúng</Label>
                      <Input placeholder="Nhập đáp án đúng..." />
                      <p className="text-xs text-muted-foreground">Hệ thống sẽ so sánh không phân biệt hoa thường</p>
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

          {questions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="mb-4 text-muted-foreground">Chưa có câu hỏi nào</p>
                <Button onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm câu hỏi đầu tiên
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
