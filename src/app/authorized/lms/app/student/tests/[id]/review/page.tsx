"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Badge } from "@lms/components/ui/badge"
import { Button } from "@lms/components/ui/button"
import { Progress } from "@lms/components/ui/progress"
import { CheckCircle2, XCircle, Clock, Calendar, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"

// Mock data
const quizResult = {
  id: 1,
  courseId: 1,
  courseName: "Lập trình Web với React & Next.js",
  quizTitle: "Kiểm tra giữa khóa - React Hooks",
  score: 85,
  totalQuestions: 20,
  correctAnswers: 17,
  timeSpent: "25 phút",
  completedAt: "2024-01-15T10:30:00",
  status: "passed",
  passingScore: 70,
  questions: [
    {
      id: 1,
      question: "useState hook được sử dụng để làm gì?",
      type: "MULTIPLE_CHOICE",
      options: ["Quản lý state trong functional component", "Gọi API", "Xử lý side effects", "Tạo context"],
      userAnswer: 0,
      correctAnswer: 0,
      isCorrect: true,
      explanation: "useState là hook cơ bản để quản lý state trong functional component.",
    },
    {
      id: 2,
      question: "useEffect chạy sau mỗi lần render?",
      type: "TRUE_FALSE",
      userAnswer: true,
      correctAnswer: true,
      isCorrect: true,
      explanation: "Mặc định useEffect chạy sau mỗi lần render, trừ khi có dependency array.",
    },
    {
      id: 3,
      question: "Hook nào dùng để tối ưu performance?",
      type: "SHORT_ANSWER",
      userAnswer: "useMemo",
      correctAnswer: "useMemo",
      isCorrect: true,
      explanation: "useMemo và useCallback đều giúp tối ưu performance.",
    },
    {
      id: 4,
      question: "Dependency array trong useEffect có tác dụng gì?",
      type: "MULTIPLE_CHOICE",
      options: ["Không có tác dụng gì", "Kiểm soát khi nào effect chạy", "Tạo state mới", "Xóa component"],
      userAnswer: 2,
      correctAnswer: 1,
      isCorrect: false,
      explanation: "Dependency array kiểm soát khi nào effect được chạy lại.",
    },
  ],
}

export default function QuizReviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/authorized/lms/app/student/tests">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{quizResult.quizTitle}</h1>
          <p className="text-muted-foreground">{quizResult.courseName}</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Kết quả</span>
                <Badge
                  variant={quizResult.status === "passed" ? "default" : "destructive"}
                  className="text-lg px-4 py-1"
                >
                  {quizResult.status === "passed" ? "Đạt" : "Chưa đạt"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Điểm số</span>
                  <span className="text-2xl font-bold">{quizResult.score}%</span>
                </div>
                <Progress value={quizResult.score} className="h-3" />
                <p className="text-xs text-muted-foreground">Điểm đạt: {quizResult.passingScore}% trở lên</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <p className="text-2xl font-bold">{quizResult.correctAnswers}</p>
                    <p className="text-xs text-muted-foreground">Câu đúng</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <div>
                    <p className="text-2xl font-bold">{quizResult.totalQuestions - quizResult.correctAnswers}</p>
                    <p className="text-xs text-muted-foreground">Câu sai</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <div>
                  <p className="text-sm">Thời gian làm bài</p>
                  <p className="text-lg font-semibold text-foreground">{quizResult.timeSpent}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <div>
                  <p className="text-sm">Hoàn thành lúc</p>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(quizResult.completedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {quizResult.status === "failed" && (
                <Button className="w-full mt-4" asChild>
                  <Link href={`/authorized/lms/app/student/courses/${quizResult.courseId}/learn`}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Làm lại bài kiểm tra
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Review */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Chi tiết câu hỏi</h2>
        <div className="space-y-4">
          {quizResult.questions.map((question, index) => (
            <Card
              key={question.id}
              className={
                question.isCorrect
                  ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
                  : "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg">
                    Câu {index + 1}: {question.question}
                  </CardTitle>
                  {question.isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
                  )}
                </div>
                <Badge variant="outline" className="w-fit">
                  {question.type === "MULTIPLE_CHOICE" && "Trắc nghiệm"}
                  {question.type === "TRUE_FALSE" && "Đúng/Sai"}
                  {question.type === "SHORT_ANSWER" && "Trả lời ngắn"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Multiple Choice */}
                {question.type === "MULTIPLE_CHOICE" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => {
                      const isUserAnswer = question.userAnswer === optIndex
                      const isCorrectAnswer = question.correctAnswer === optIndex

                      return (
                        <div
                          key={optIndex}
                          className={`rounded-lg border-2 p-3 ${
                            isCorrectAnswer
                              ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                              : isUserAnswer
                                ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                                : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{String.fromCharCode(65 + optIndex)}.</span>
                            <span>{option}</span>
                            {isCorrectAnswer && (
                              <Badge variant="default" className="ml-auto">
                                Đáp án đúng
                              </Badge>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <Badge variant="destructive" className="ml-auto">
                                Bạn chọn
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* True/False */}
                {question.type === "TRUE_FALSE" && (
                  <div className="space-y-2">
                    <div
                      className={`rounded-lg border-2 p-3 ${
                        question.correctAnswer === true
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : question.userAnswer === true
                            ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                            : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Đúng</span>
                        {question.correctAnswer === true && <Badge variant="default">Đáp án đúng</Badge>}
                        {question.userAnswer === true && question.correctAnswer !== true && (
                          <Badge variant="destructive">Bạn chọn</Badge>
                        )}
                      </div>
                    </div>
                    <div
                      className={`rounded-lg border-2 p-3 ${
                        question.correctAnswer === false
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : question.userAnswer === false
                            ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                            : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Sai</span>
                        {question.correctAnswer === false && <Badge variant="default">Đáp án đúng</Badge>}
                        {question.userAnswer === false && question.correctAnswer !== false && (
                          <Badge variant="destructive">Bạn chọn</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Short Answer */}
                {question.type === "SHORT_ANSWER" && (
                  <div className="space-y-3">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-muted-foreground">Câu trả lời của bạn:</p>
                      <div
                        className={`rounded-lg border-2 p-3 ${
                          question.isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                            : "border-red-500 bg-red-50 dark:bg-red-950/30"
                        }`}
                      >
                        {question.userAnswer}
                      </div>
                    </div>
                    {!question.isCorrect && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-muted-foreground">Đáp án đúng:</p>
                        <div className="rounded-lg border-2 border-green-500 bg-green-50 p-3 dark:bg-green-950/30">
                          {question.correctAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {question.explanation && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="mb-1 text-sm font-semibold">Giải thích:</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
