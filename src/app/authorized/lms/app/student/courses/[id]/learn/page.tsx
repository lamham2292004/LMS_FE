"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, CheckCircle2, PlayCircle, FileText, Menu, X } from "lucide-react"
import Link from "next/link"

const lessons = [
  { id: 1, title: "Giới thiệu về Python", type: "video", completed: true },
  { id: 2, title: "Cài đặt môi trường", type: "video", completed: true },
  { id: 3, title: "Biến và kiểu dữ liệu", type: "video", completed: true },
  { id: 4, title: "Câu lệnh điều kiện", type: "video", completed: false },
  { id: 5, title: "Vòng lặp trong Python", type: "video", completed: false },
  { id: 6, title: "Bài kiểm tra Module 1", type: "quiz", completed: false },
]

const quizData = {
  title: "Bài kiểm tra Module 1",
  duration: 30,
  totalQuestions: 5,
  passingScore: 70,
  questions: [
    {
      id: 1,
      question: "Python là ngôn ngữ lập trình gì?",
      options: ["Ngôn ngữ biên dịch", "Ngôn ngữ thông dịch", "Ngôn ngữ assembly", "Ngôn ngữ máy"],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Cú pháp nào sau đây đúng để khai báo biến trong Python?",
      options: ["int x = 5", "var x = 5", "x = 5", "let x = 5"],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "Hàm nào dùng để in ra màn hình trong Python?",
      options: ["console.log()", "echo()", "print()", "printf()"],
      correctAnswer: 2,
    },
  ],
}

export default function LessonViewerPage() {
  const [currentLesson, setCurrentLesson] = useState(4)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const lesson = lessons.find((l) => l.id === currentLesson)
  const isQuiz = lesson?.type === "quiz"

  const handleNextLesson = () => {
    if (currentLesson < lessons.length) {
      setCurrentLesson(currentLesson + 1)
      setQuizSubmitted(false)
      setQuizAnswers({})
    }
  }

  const handlePrevLesson = () => {
    if (currentLesson > 1) {
      setCurrentLesson(currentLesson - 1)
      setQuizSubmitted(false)
      setQuizAnswers({})
    }
  }

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
  }

  const calculateScore = () => {
    let correct = 0
    quizData.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / quizData.questions.length) * 100)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link href="/student/courses/1">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại khóa học
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground">Tiến độ khóa học</p>
            <div className="flex items-center gap-2">
              <Progress value={65} className="w-32" />
              <span className="text-sm font-semibold">65%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 overflow-y-auto border-r border-border bg-card">
            <div className="p-4">
              <h2 className="mb-4 text-lg font-bold">Nội dung khóa học</h2>

              <div className="space-y-2">
                {lessons.map((l, index) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setCurrentLesson(l.id)
                      setQuizSubmitted(false)
                      setQuizAnswers({})
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                      currentLesson === l.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10">
                      {l.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : l.type === "quiz" ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <PlayCircle className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {index + 1}. {l.title}
                      </p>
                      <p className="text-xs opacity-80">{l.type === "quiz" ? "Bài kiểm tra" : "Video"}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl p-6">
            {isQuiz ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{quizData.title}</CardTitle>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Thời gian: {quizData.duration} phút</span>
                        <span>•</span>
                        <span>{quizData.totalQuestions} câu hỏi</span>
                        <span>•</span>
                        <span>Điểm đạt: {quizData.passingScore}%</span>
                      </div>
                    </div>
                    {quizSubmitted && (
                      <Badge
                        variant={calculateScore() >= quizData.passingScore ? "default" : "destructive"}
                        className="text-lg"
                      >
                        {calculateScore()}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  {quizData.questions.map((q, index) => (
                    <div key={q.id} className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <h3 className="flex-1 text-lg font-semibold">{q.question}</h3>
                      </div>

                      <RadioGroup
                        value={quizAnswers[q.id]?.toString()}
                        onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [q.id]: Number.parseInt(value) })}
                        disabled={quizSubmitted}
                      >
                        {q.options.map((option, optIndex) => {
                          const isSelected = quizAnswers[q.id] === optIndex
                          const isCorrect = q.correctAnswer === optIndex
                          const showResult = quizSubmitted

                          return (
                            <div
                              key={optIndex}
                              className={`flex items-center space-x-3 rounded-lg border p-4 ${
                                showResult && isCorrect
                                  ? "border-success bg-success/10"
                                  : showResult && isSelected && !isCorrect
                                    ? "border-destructive bg-destructive/10"
                                    : "border-border"
                              }`}
                            >
                              <RadioGroupItem value={optIndex.toString()} id={`q${q.id}-${optIndex}`} />
                              <Label htmlFor={`q${q.id}-${optIndex}`} className="flex-1 cursor-pointer">
                                {option}
                              </Label>
                              {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <Button
                      onClick={handleSubmitQuiz}
                      size="lg"
                      className="w-full"
                      disabled={Object.keys(quizAnswers).length < quizData.questions.length}
                    >
                      Nộp bài
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Card
                        className={calculateScore() >= quizData.passingScore ? "border-success" : "border-destructive"}
                      >
                        <CardContent className="p-6 text-center">
                          <h3 className="mb-2 text-2xl font-bold">
                            {calculateScore() >= quizData.passingScore ? "Chúc mừng!" : "Chưa đạt"}
                          </h3>
                          <p className="text-muted-foreground">
                            Bạn đã trả lời đúng{" "}
                            {
                              Object.values(quizAnswers).filter((a, i) => a === quizData.questions[i].correctAnswer)
                                .length
                            }
                            /{quizData.questions.length} câu
                          </p>
                        </CardContent>
                      </Card>

                      {calculateScore() >= quizData.passingScore && (
                        <Button onClick={handleNextLesson} size="lg" className="w-full">
                          Tiếp tục bài học tiếp theo
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Video Player */}
                <Card>
                  <div className="relative aspect-video overflow-hidden rounded-t-lg bg-black">
                    <div className="flex h-full items-center justify-center">
                      <PlayCircle className="h-20 w-20 text-white/80" />
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h1 className="mb-2 text-2xl font-bold">{lesson?.title}</h1>
                    <p className="text-muted-foreground">
                      Trong bài học này, bạn sẽ học về {lesson?.title.toLowerCase()}. Hãy chú ý theo dõi và thực hành
                      các ví dụ được đưa ra.
                    </p>
                  </CardContent>
                </Card>

                {/* Lesson Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ghi chú bài học</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Đây là phần ghi chú cho bài học. Bạn có thể thêm ghi chú của riêng mình trong quá trình học.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex h-16 items-center justify-between border-t border-border px-6">
        <Button variant="outline" onClick={handlePrevLesson} disabled={currentLesson === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Bài trước
        </Button>

        <Button onClick={handleNextLesson} disabled={currentLesson === lessons.length || (isQuiz && !quizSubmitted)}>
          Bài tiếp theo
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
