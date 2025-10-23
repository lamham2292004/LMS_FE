"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Badge } from "@lms/components/ui/badge"
import { Button } from "@lms/components/ui/button"
import { Progress } from "@lms/components/ui/progress"
import { CheckCircle2, XCircle, Clock, Calendar, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useQuizResultDetail } from "@/lib/hooks/useLms"
import { useQuiz } from "@/lib/hooks/useLms"

export default function QuizReviewPage({ params }: { params: { id: string } }) {
  const resultId = parseInt(params.id)
  const { result, loading, error, fetchResult } = useQuizResultDetail(resultId)
  const { quiz, loading: quizLoading, fetchQuiz } = useQuiz(result?.quizId || 0)

  useEffect(() => {
    fetchResult()
  }, [fetchResult])

  useEffect(() => {
    if (result?.quizId) {
      fetchQuiz()
    }
  }, [result?.quizId, fetchQuiz])

  if (loading || quizLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải kết quả...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-500">Không thể tải kết quả</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {error?.message || "Kết quả bài kiểm tra không tồn tại"}
                </p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/authorized/lms/app/student/tests">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isPassed = result.isPassed
  const scorePercentage = Number(result.score) || 0

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
          <h1 className="text-3xl font-bold">{result.quizTitle}</h1>
          <p className="text-muted-foreground">Lần thử: {result.attemptNumber}</p>
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
                  variant={isPassed ? "default" : "destructive"}
                  className="text-lg px-4 py-1"
                >
                  {isPassed ? "Đạt" : "Chưa đạt"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Điểm số</span>
                  <span className="text-2xl font-bold">{scorePercentage.toFixed(1)}%</span>
                </div>
                <Progress value={scorePercentage} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  Điểm đạt: {quiz?.passScore || 60}% trở lên
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <p className="text-2xl font-bold">{result.correctAnswers}</p>
                    <p className="text-xs text-muted-foreground">Câu đúng</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <div>
                    <p className="text-2xl font-bold">
                      {result.totalQuestions - result.correctAnswers}
                    </p>
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
                  <p className="text-lg font-semibold text-foreground">
                    {result.timeTaken} phút
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <div>
                  <p className="text-sm">Hoàn thành lúc</p>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(result.takenAt).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      {result.feedback && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {result.feedback.split('\n').map((line, index) => {
                const isCorrect = line.includes('Đúng')
                const isWrong = line.includes('Sai') || line.includes('Chưa trả lời')
                
                return (
                  <div
                    key={index}
                    className={`p-3 mb-2 rounded-lg ${
                      isCorrect
                        ? 'bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500'
                        : isWrong
                          ? 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500'
                          : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />}
                      {isWrong && <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />}
                      <span className={isCorrect ? 'text-green-700 dark:text-green-400' : isWrong ? 'text-red-700 dark:text-red-400' : ''}>
                        {line}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Questions Detail - if available */}
      {quiz?.questions && quiz.questions.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold">Danh sách câu hỏi</h2>
          <div className="space-y-4">
            {quiz.questions.map((question: any, index: number) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">
                      Câu {index + 1}: {question.questionText}
                    </CardTitle>
                    <Badge variant="outline" className="flex-shrink-0">
                      {question.points} điểm
                    </Badge>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {question.questionType === "MULTIPLE_CHOICE" && "Trắc nghiệm"}
                    {question.questionType === "TRUE_FALSE" && "Đúng/Sai"}
                    {question.questionType === "SHORT_ANSWER" && "Trả lời ngắn"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {question.answerOptions && question.answerOptions.map((option: any, optIndex: number) => {
                    const isCorrectAnswer = option.isCorrect

                    return (
                      <div
                        key={option.id}
                        className={`rounded-lg border-2 p-3 ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span>{option.answerText}</span>
                          {isCorrectAnswer && (
                            <Badge variant="default" className="ml-auto">
                              Đáp án đúng
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
