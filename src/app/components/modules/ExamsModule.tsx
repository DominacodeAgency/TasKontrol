import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import { Progress } from '@/app/components/ui/progress';
import { EmptyState } from '@/app/components/EmptyState';
import { mockExams } from '@/app/data/mockData';
import { Exam, Question } from '@/app/types';
import { GraduationCap, Calendar, CheckCircle, Circle, Award } from 'lucide-react';
import { toast } from 'sonner';

export function ExamsModule() {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const pendingExams = exams.filter(e => e.status === 'pending');
  const completedExams = exams.filter(e => e.status === 'completed');

  const startExam = (exam: Exam) => {
    setSelectedExam(exam);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const nextQuestion = () => {
    if (selectedExam && currentQuestion < selectedExam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitExam = () => {
    if (!selectedExam) return;

    let correct = 0;
    selectedExam.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / selectedExam.questions.length) * 100);

    // Actualizar el examen
    setExams(prev => prev.map(exam =>
      exam.id === selectedExam.id
        ? {
            ...exam,
            status: 'completed',
            score,
            questions: exam.questions.map(q => ({
              ...q,
              userAnswer: answers[q.id],
            })),
          }
        : exam
    ));

    setShowResults(true);

    toast.success('Examen completado', {
      description: `Has obtenido ${score} puntos`,
    });
  };

  const closeExam = () => {
    setSelectedExam(null);
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const isExamComplete = selectedExam
    ? Object.keys(answers).length === selectedExam.questions.length
    : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exámenes</h1>
        <p className="text-sm text-muted-foreground">
          Completa las evaluaciones de formación
        </p>
      </div>

      {/* Pending exams */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Exámenes pendientes</h2>
        {pendingExams.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <EmptyState
                icon={GraduationCap}
                title="No hay exámenes pendientes"
                description="¡Enhorabuena! Has completado todos tus exámenes"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingExams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {exam.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      Pendiente
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Circle className="w-4 h-4" />
                      <span>{exam.questions.length} preguntas</span>
                    </div>
                    {exam.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Vence: {new Date(exam.dueDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    )}
                    <Button className="w-full" onClick={() => startExam(exam)}>
                      Comenzar examen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed exams */}
      {completedExams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Exámenes completados</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completedExams.map((exam) => (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {exam.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completado
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Puntuación:</span>
                      <div className="flex items-center gap-2">
                        <Award className={`w-5 h-5 ${
                          (exam.score || 0) >= 70 ? 'text-green-600' : 'text-orange-600'
                        }`} />
                        <span className={`text-lg font-bold ${
                          (exam.score || 0) >= 70 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {exam.score}%
                        </span>
                      </div>
                    </div>
                    <Progress value={exam.score || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Exam dialog */}
      <Dialog open={!!selectedExam} onOpenChange={(open) => !open && closeExam()}>
        <DialogContent className="sm:max-w-2xl">
          {selectedExam && !showResults && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedExam.title}</DialogTitle>
                <DialogDescription>
                  Pregunta {currentQuestion + 1} de {selectedExam.questions.length}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <Progress
                  value={((currentQuestion + 1) / selectedExam.questions.length) * 100}
                  className="h-2"
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">
                    {selectedExam.questions[currentQuestion].text}
                  </h3>

                  <RadioGroup
                    value={answers[selectedExam.questions[currentQuestion].id]?.toString()}
                    onValueChange={(value) =>
                      handleAnswer(selectedExam.questions[currentQuestion].id, parseInt(value))
                    }
                  >
                    {selectedExam.questions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-between gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Anterior
                  </Button>
                  <div className="flex gap-2">
                    {currentQuestion < selectedExam.questions.length - 1 ? (
                      <Button onClick={nextQuestion}>
                        Siguiente
                      </Button>
                    ) : (
                      <Button
                        onClick={submitExam}
                        disabled={!isExamComplete}
                      >
                        Finalizar examen
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedExam && showResults && (
            <>
              <DialogHeader>
                <DialogTitle>Resultados del examen</DialogTitle>
                <DialogDescription>{selectedExam.title}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    {Math.round(
                      (selectedExam.questions.filter(
                        (q) => answers[q.id] === q.correctAnswer
                      ).length /
                        selectedExam.questions.length) *
                        100
                    )}%
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedExam.questions.filter((q) => answers[q.id] === q.correctAnswer).length}{' '}
                    de {selectedExam.questions.length} respuestas correctas
                  </p>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedExam.questions.map((question, index) => {
                    const isCorrect = answers[question.id] === question.correctAnswer;
                    return (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg border-2 ${
                          isCorrect
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : (
                            <Circle className="w-5 h-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1 space-y-2">
                            <p className="font-medium text-foreground">
                              {index + 1}. {question.text}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Tu respuesta: {question.options[answers[question.id]]}
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-700 font-medium">
                                Correcta: {question.options[question.correctAnswer]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <Button onClick={closeExam}>Cerrar</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
