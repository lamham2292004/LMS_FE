"use client"

import { useState, useEffect } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Textarea } from "@lms/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@lms/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lms/components/ui/select"
import { Plus, Trash2, Save, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { lmsApiClient, QuestionType } from "@/lib/lms-api-client"
import { useCourseDetails } from "@/lib/hooks/useCourseDetails"

interface Question {
  id: number
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: number | string
  points: number
}

export default function NewQuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const courseId = parseInt(params.id)
  const { course, loading: courseLoading } = useCourseDetails(courseId)
  
  // Quiz settings
  const [lessonId, setLessonId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState("30")
  const [passScore, setPassScore] = useState("70")
  const [maxAttempts, setMaxAttempts] = useState("3")
  
  // Question states
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: "MULTIPLE_CHOICE",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    },
  ])

  // Saving state
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addQuestion = (type: QuestionType = "MULTIPLE_CHOICE") => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type,
      question: "",
      options: type === "MULTIPLE_CHOICE" ? ["", "", "", ""] : type === "TRUE_FALSE" ? ["Đúng", "Sai"] : [],
      correctAnswer: type === "SHORT_ANSWER" ? "" : 0,
      points: 1,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    )
  }

  const updateQuestionOption = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
          : q
      )
    )
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

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      // Validate inputs
      if (!lessonId) {
        setError("Vui lòng chọn bài học")
        return
      }
      if (!title.trim()) {
        setError("Vui lòng nhập tiêu đề bài kiểm tra")
        return
      }
      if (questions.some(q => !q.question.trim())) {
        setError("Vui lòng nhập nội dung cho tất cả câu hỏi")
        return
      }

      // Create quiz
      const quizData = {
        lessonId: parseInt(lessonId),
        title: title.trim(),
        description: description.trim(),
        timeLimit: parseInt(timeLimit) || undefined,
        maxAttempts: parseInt(maxAttempts) || undefined,
        passScore: parseInt(passScore) || undefined,
      }

      const quizResponse = await lmsApiClient.createQuiz(quizData)
      const createdQuiz = quizResponse.result

      if (!createdQuiz) {
        throw new Error("Không thể tạo bài kiểm tra")
      }

      // Create questions and answers
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        
        const questionData = {
          quizId: createdQuiz.id,
          questionText: q.question.trim(),
          questionType: q.type,
          points: q.points,
          orderIndex: i + 1,
        }

        const questionResponse = await lmsApiClient.createQuestion(questionData)
        const createdQuestion = questionResponse.result

        if (!createdQuestion) {
          throw new Error(`Không thể tạo câu hỏi ${i + 1}`)
        }

        // Create answer options for MULTIPLE_CHOICE and TRUE_FALSE
        if (q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE") {
          for (let j = 0; j < q.options.length; j++) {
            const optionText = q.options[j].trim()
            if (optionText) {
              const answerData = {
                questionId: createdQuestion.id,
                answerText: optionText,
                isCorrect: q.correctAnswer === j,
                orderIndex: j + 1,
              }
              await lmsApiClient.createAnswerOption(answerData)
            }
          }
        }
      }

      // Success - redirect back to course management
      alert("Tạo bài kiểm tra thành công!")
      router.push(`/authorized/lms/app/lecturer/courses/${params.id}`)
    } catch (err: any) {
      console.error("Error creating quiz:", err)
      setError(err.message || "Có lỗi xảy ra khi tạo bài kiểm tra")
    } finally {
      setSaving(false)
    }
  }

  // Show loading state
  if (courseLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Tạo bài kiểm tra mới" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
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

            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu bài kiểm tra
                </>
              )}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="mb-6 border-destructive">
              <CardContent className="p-4 flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Quiz Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cài đặt bài kiểm tra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lesson">Bài học <span className="text-destructive">*</span></Label>
                <Select value={lessonId} onValueChange={setLessonId}>
                  <SelectTrigger id="lesson">
                    <SelectValue placeholder="Chọn bài học để gắn bài kiểm tra" />
                  </SelectTrigger>
                  <SelectContent>
                    {course?.lessons?.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id.toString()}>
                        {lesson.orderIndex}. {lesson.title}
                      </SelectItem>
                    ))}
                    {(!course?.lessons || course.lessons.length === 0) && (
                      <SelectItem value="no-lessons" disabled>
                        Chưa có bài học nào
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Bài kiểm tra sẽ được gắn với bài học này
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề <span className="text-destructive">*</span></Label>
                <Input 
                  id="title" 
                  placeholder="VD: Bài kiểm tra Module 1" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea 
                  id="description" 
                  rows={3} 
                  placeholder="Mô tả về bài kiểm tra..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời gian (phút)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passingScore">Điểm đạt (%)</Label>
                  <Input 
                    id="passingScore" 
                    type="number" 
                    value={passScore}
                    onChange={(e) => setPassScore(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attempts">Số lần làm</Label>
                  <Input 
                    id="attempts" 
                    type="number" 
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(e.target.value)}
                  />
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
                    <Label>Nội dung câu hỏi <span className="text-destructive">*</span></Label>
                    <Textarea 
                      placeholder="Nhập câu hỏi..." 
                      rows={2} 
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Điểm</Label>
                    <Input 
                      type="number" 
                      min="1"
                      value={question.points}
                      onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                      className="w-24"
                    />
                  </div>

                  {question.type === "MULTIPLE_CHOICE" && (
                    <div className="space-y-2">
                      <Label>Các đáp án</Label>
                      <RadioGroup 
                        value={question.correctAnswer.toString()}
                        onValueChange={(value) => updateQuestion(question.id, 'correctAnswer', parseInt(value))}
                      >
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-3">
                            <RadioGroupItem value={optIndex.toString()} id={`q${question.id}-opt${optIndex}`} />
                            <Input 
                              placeholder={`Đáp án ${String.fromCharCode(65 + optIndex)}`} 
                              className="flex-1" 
                              value={option}
                              onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                            />
                          </div>
                        ))}
                      </RadioGroup>
                      <p className="text-xs text-muted-foreground">Chọn radio button để đánh dấu đáp án đúng</p>
                    </div>
                  )}

                  {question.type === "TRUE_FALSE" && (
                    <div className="space-y-2">
                      <Label>Đáp án đúng</Label>
                      <RadioGroup 
                        value={question.correctAnswer.toString()}
                        onValueChange={(value) => updateQuestion(question.id, 'correctAnswer', parseInt(value))}
                      >
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
                      <Textarea 
                        placeholder="Nhập đáp án mẫu hoặc từ khóa cần có trong câu trả lời..." 
                        rows={2} 
                        value={question.correctAnswer as string}
                        onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Câu trả lời của học viên sẽ được so sánh với đáp án này
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
