"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@lms/components/ui/radio-group"
import { Label } from "@lms/components/ui/label"
import { Input } from "@lms/components/ui/input"
import { Textarea } from "@lms/components/ui/textarea"
import { Alert, AlertDescription } from "@lms/components/ui/alert"
import { Progress } from "@lms/components/ui/progress"
import { 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  Timer,
  FileQuestion
} from "lucide-react"
import Link from "next/link"
import { useQuiz, useQuestionsByQuiz, useSubmitQuiz } from '@/lib/hooks/useLms'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = parseInt(params.id as string)
  const lessonId = parseInt(params.lessonId as string)
  const quizId = parseInt(params.quizId as string)
  
  const { data: quiz, loading: loadingQuiz, error: quizError, execute: fetchQuiz } = useQuiz(quizId)
  const { questions, loading: loadingQuestions, error: questionsError, fetchQuestions } = useQuestionsByQuiz(quizId)
  const { submitQuiz, loading: submitting } = useSubmitQuiz()

  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [submitResult, setSubmitResult] = useState<any>(null)

  useEffect(() => {
    if (quizId) {
      fetchQuiz()
      fetchQuestions()
    }
  }, [quizId])

  // Timer countdown
  useEffect(() => {
    if (quizStarted && timeRemaining !== null && timeRemaining > 0 && !quizSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quizStarted, timeRemaining, quizSubmitted])

  // Auto submit when time runs out
  useEffect(() => {
    if (quizStarted && timeRemaining === 0 && !quizSubmitted) {
      console.log('⏰ Hết thời gian! Tự động nộp bài...')
      handleSubmitQuiz()
    }
  }, [timeRemaining, quizStarted, quizSubmitted])

  const startQuiz = () => {
    setQuizStarted(true)
    if (quiz?.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60) // Convert minutes to seconds
    }
  }

  const handleAnswerChange = (questionId: number, answerOptionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerOptionId
    }))
  }

  const handleSubmitQuiz = async () => {
    if (!quiz || !questions) return

    try {
      const timeTaken = quiz.timeLimit 
        ? Math.round((quiz.timeLimit * 60 - (timeRemaining || 0)) / 60) 
        : 0

      const result = await submitQuiz({
        quizId: quiz.id,
        answers: answers,
        timeTaken: timeTaken
      })

      setSubmitResult(result)
      setQuizSubmitted(true)
    } catch (error: any) {
      alert(`Lỗi khi nộp bài: ${error.message || 'Vui lòng thử lại'}`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const answeredCount = Object.keys(answers).length
  const totalQuestions = questions?.length || 0
  const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  if (loadingQuiz || loadingQuestions) {
    return (
      <div className="flex flex-col">
        <Header title="Đang tải bài kiểm tra..." showCart />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải bài kiểm tra từ backend...</p>
          </div>
        </div>
      </div>
    )
  }

  if (quizError || questionsError || !quiz) {
    return (
      <div className="flex flex-col">
        <Header title="Lỗi" showCart />
        <div className="flex-1 p-6">
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="mb-4 text-2xl font-bold text-destructive">
              {quizError?.message || questionsError?.message || "Không tìm thấy bài kiểm tra"}
            </h1>
            <Button asChild>
              <Link href={`/authorized/lms/app/student/courses/${courseId}/lessons/${lessonId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại bài học
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // Quiz submitted - show results
  if (quizSubmitted && submitResult) {
    return (
      <div className="flex flex-col">
        <Header title="Kết quả bài kiểm tra" showCart />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                {submitResult.isPassed ? (
                  <>
                    <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-success mb-4">Chúc mừng! Bạn đã đạt</h1>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-destructive mb-4">Chưa đạt yêu cầu</h1>
                  </>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Điểm số</p>
                    <p className="text-3xl font-bold text-primary">{submitResult.score}%</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Số câu đúng</p>
                    <p className="text-3xl font-bold">{submitResult.correctAnswers}/{submitResult.totalQuestions}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Thời gian</p>
                    <p className="text-3xl font-bold">{submitResult.timeTaken} phút</p>
                  </div>
                </div>

                {submitResult.feedback && (
                  <Alert className="mt-6">
                    <AlertDescription>{submitResult.feedback}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4 justify-center mt-8">
                  <Button variant="outline" asChild>
                    <Link href={`/authorized/lms/app/student/courses/${courseId}/lessons/${lessonId}`}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại bài học
                    </Link>
                  </Button>
                  {!submitResult.isPassed && quiz.maxAttempts && submitResult.attemptNumber < quiz.maxAttempts && (
                    <Button onClick={() => window.location.reload()}>
                      Thử lại
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Quiz not started - show start screen
  if (!quizStarted) {
    return (
      <div className="flex flex-col">
        <Header title={quiz.title} showCart />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-4" asChild>
              <Link href={`/authorized/lms/app/student/courses/${courseId}/lessons/${lessonId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại bài học
              </Link>
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="h-6 w-6" />
                  {quiz.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Mô tả</h3>
                  <p className="text-muted-foreground">{quiz.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quiz.timeLimit && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Thời gian</p>
                        <p className="font-semibold">{quiz.timeLimit} phút</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <FileQuestion className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Số câu hỏi</p>
                      <p className="font-semibold">{totalQuestions} câu</p>
                    </div>
                  </div>

                  {quiz.maxAttempts && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Số lần thử</p>
                        <p className="font-semibold">Tối đa {quiz.maxAttempts} lần</p>
                      </div>
                    </div>
                  )}

                  {quiz.passScore && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Điểm đạt</p>
                        <p className="font-semibold">{quiz.passScore}%</p>
                      </div>
                    </div>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Sau khi bắt đầu, bạn cần hoàn thành bài kiểm tra trong thời gian quy định. 
                    Hãy chắc chắn rằng bạn đã sẵn sàng!
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button onClick={startQuiz} size="lg" className="flex-1">
                    Bắt đầu bài kiểm tra
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Quiz in progress
  const currentQuestion = questions?.[currentQuestionIndex]

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={quiz.title} showCart />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Timer and Progress */}
          <div className="mb-6 space-y-4">
            {timeRemaining !== null && (
              <Alert className={timeRemaining < 60 ? "border-destructive" : ""}>
                <Timer className={`h-4 w-4 ${timeRemaining < 60 ? "text-destructive" : ""}`} />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>Thời gian còn lại:</span>
                    <span className={`font-bold text-lg ${timeRemaining < 60 ? "text-destructive" : ""}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Tiến độ</span>
                  <span className="text-sm font-semibold">{answeredCount}/{totalQuestions} câu đã trả lời</span>
                </div>
                <Progress value={progressPercentage} />
              </CardContent>
            </Card>
          </div>

          {/* Question */}
          {currentQuestion && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">
                    Câu {currentQuestionIndex + 1}/{totalQuestions}
                  </Badge>
                  <Badge variant="outline">
                    {currentQuestion.points} điểm
                  </Badge>
                </div>
                <CardTitle className="text-xl">{currentQuestion.questionText}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Multiple Choice / True False - RadioGroup */}
                {(currentQuestion.questionType === 'MULTIPLE_CHOICE' || currentQuestion.questionType === 'TRUE_FALSE') && (
                  <RadioGroup
                    value={answers[currentQuestion.id]?.toString()}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    <div className="space-y-3">
                      {currentQuestion.answerOptions?.map((option) => (
                        <div
                          key={option.id}
                          className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${
                            answers[currentQuestion.id]?.toString() === option.id.toString()
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                          <Label 
                            htmlFor={`option-${option.id}`} 
                            className="flex-1 cursor-pointer"
                          >
                            {option.answerText}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {/* Short Answer - Textarea */}
                {currentQuestion.questionType === 'SHORT_ANSWER' && (
                  <div className="space-y-3">
                    <Label htmlFor={`answer-${currentQuestion.id}`}>
                      Nhập câu trả lời của bạn:
                    </Label>
                    <Textarea
                      id={`answer-${currentQuestion.id}`}
                      placeholder="Nhập câu trả lời..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Hãy trả lời một cách rõ ràng và đầy đủ
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Câu trước
            </Button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              >
                Câu sau
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuiz}
                disabled={submitting || answeredCount === 0}
                className="bg-success hover:bg-success/90"
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Đang nộp bài..." : "Nộp bài"}
              </Button>
            )}
          </div>

          {/* Question Navigator */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">Điều hướng câu hỏi</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {questions?.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`
                      aspect-square rounded-lg border-2 font-semibold text-sm transition-colors
                      ${currentQuestionIndex === index 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : answers[q.id] 
                          ? 'border-success bg-success/10 text-success hover:bg-success/20'
                          : 'border-muted hover:bg-accent'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

