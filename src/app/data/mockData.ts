import { Task, Incident, HistoryRecord, Exam, Message, Publication } from '@/app/types';

export const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Revisión de equipos de climatización',
    description: 'Revisar y limpiar todos los filtros de aire acondicionado',
    assignedTo: ['emp1', 'emp2'],
    assignedBy: 'admin1',
    status: 'pending',
    template: 'summer',
    images: [],
    createdAt: '2026-01-15T10:00:00Z',
    dueDate: '2026-01-20T18:00:00Z',
  },
  {
    id: '2',
    name: 'Mantenimiento de calderas',
    description: 'Revisión completa de calderas antes de la temporada de invierno',
    assignedTo: ['emp3'],
    assignedBy: 'admin1',
    status: 'in-progress',
    template: 'winter',
    images: [],
    createdAt: '2026-01-10T09:00:00Z',
    dueDate: '2026-01-18T17:00:00Z',
  },
  {
    id: '3',
    name: 'Inspección de seguridad',
    description: 'Verificar extintores y señalización de emergencia',
    assignedTo: ['emp1'],
    assignedBy: 'admin1',
    status: 'completed',
    images: [],
    createdAt: '2026-01-05T08:00:00Z',
    dueDate: '2026-01-15T18:00:00Z',
  },
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    name: 'Fuga de agua en sala de calderas',
    description: 'Se detectó una pequeña fuga en la tubería principal',
    reportedBy: 'emp2',
    assignedTo: 'emp3',
    status: 'in-progress',
    priority: 'high',
    images: [],
    createdAt: '2026-01-17T14:30:00Z',
  },
  {
    id: '2',
    name: 'Fallo eléctrico en planta 2',
    description: 'Interruptor diferencial salta constantemente',
    reportedBy: 'emp1',
    assignedTo: 'emp4',
    status: 'open',
    priority: 'critical',
    images: [],
    createdAt: '2026-01-18T09:15:00Z',
  },
  {
    id: '3',
    name: 'Puerta de acceso atascada',
    description: 'La puerta principal no cierra correctamente',
    reportedBy: 'emp3',
    assignedTo: 'emp2',
    status: 'resolved',
    priority: 'medium',
    images: [],
    createdAt: '2026-01-12T11:00:00Z',
    resolvedAt: '2026-01-13T16:30:00Z',
  },
];

export const mockHistory: HistoryRecord[] = [
  {
    id: '1',
    type: 'task',
    name: 'Mantenimiento preventivo bomba A3',
    equipment: 'Bomba A3',
    user: 'Juan Pérez',
    startDate: '2025-12-15T08:00:00Z',
    endDate: '2025-12-15T12:00:00Z',
    status: 'completed',
  },
  {
    id: '2',
    type: 'incident',
    name: 'Sobrecalentamiento motor ventilador',
    equipment: 'Ventilador V12',
    user: 'María García',
    startDate: '2025-12-10T14:00:00Z',
    endDate: '2025-12-11T10:00:00Z',
    status: 'resolved',
  },
  {
    id: '3',
    type: 'task',
    name: 'Calibración sensor temperatura',
    equipment: 'Sensor T45',
    user: 'Carlos López',
    startDate: '2025-12-05T09:00:00Z',
    endDate: '2025-12-05T11:30:00Z',
    status: 'completed',
  },
  {
    id: '4',
    type: 'incident',
    name: 'Vibración anormal compressor',
    equipment: 'Compresor C7',
    user: 'Ana Martínez',
    startDate: '2025-11-28T16:00:00Z',
    endDate: '2025-11-29T18:00:00Z',
    status: 'resolved',
  },
  {
    id: '5',
    type: 'task',
    name: 'Cambio de filtros sistema HVAC',
    equipment: 'HVAC Zona Norte',
    user: 'Juan Pérez',
    startDate: '2025-11-20T08:00:00Z',
    endDate: '2025-11-20T14:00:00Z',
    status: 'completed',
  },
];

export const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Seguridad y Prevención de Riesgos Laborales',
    description: 'Evaluación de conocimientos básicos en prevención de riesgos',
    questions: [
      {
        id: 'q1',
        text: '¿Cuál es el color de las señales de prohibición?',
        options: ['Verde', 'Rojo', 'Amarillo', 'Azul'],
        correctAnswer: 1,
      },
      {
        id: 'q2',
        text: '¿Cada cuánto tiempo deben revisarse los extintores?',
        options: ['Cada mes', 'Cada 3 meses', 'Cada 6 meses', 'Cada año'],
        correctAnswer: 3,
      },
      {
        id: 'q3',
        text: '¿Qué significa EPP?',
        options: [
          'Equipo de Protección Personal',
          'Equipo de Prevención Profesional',
          'Equipamiento Para Producción',
          'Elemento de Protección Preventiva'
        ],
        correctAnswer: 0,
      },
    ],
    createdBy: 'admin1',
    createdAt: '2026-01-10T10:00:00Z',
    dueDate: '2026-01-25T23:59:00Z',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Mantenimiento de Sistemas HVAC',
    description: 'Conocimientos técnicos sobre climatización',
    questions: [
      {
        id: 'q1',
        text: '¿Qué significa HVAC?',
        options: [
          'High Voltage Air Conditioning',
          'Heating, Ventilation and Air Conditioning',
          'Heavy Ventilation Air Control',
          'Home Ventilation Automatic Control'
        ],
        correctAnswer: 1,
      },
      {
        id: 'q2',
        text: '¿Con qué frecuencia deben limpiarse los filtros de aire?',
        options: ['Semanalmente', 'Mensualmente', 'Trimestralmente', 'Anualmente'],
        correctAnswer: 1,
        userAnswer: 1,
      },
    ],
    createdBy: 'admin1',
    createdAt: '2025-12-20T10:00:00Z',
    dueDate: '2026-01-10T23:59:00Z',
    status: 'completed',
    score: 50,
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'Nueva política de seguridad implementada',
    body: 'A partir del 1 de febrero, todos los empleados deberán completar el curso de seguridad actualizado. Por favor, revisen el material en la sección de Exámenes.',
    from: 'Administración',
    createdAt: '2026-01-18T09:00:00Z',
    read: false,
    priority: 'important',
  },
  {
    id: '2',
    subject: 'Mantenimiento programado - 20 de enero',
    body: 'El próximo viernes 20 de enero realizaremos mantenimiento en las instalaciones eléctricas. Algunas áreas podrían quedar sin suministro entre las 14:00 y 16:00 horas.',
    from: 'Dirección Técnica',
    createdAt: '2026-01-17T14:30:00Z',
    read: true,
    priority: 'urgent',
  },
  {
    id: '3',
    subject: 'Recordatorio: Actualización de datos personales',
    body: 'Les recordamos que tienen hasta el 31 de enero para actualizar sus datos personales en el sistema de RRHH.',
    from: 'Recursos Humanos',
    createdAt: '2026-01-15T11:00:00Z',
    read: true,
    priority: 'normal',
  },
];

export const mockPublications: Publication[] = [
  {
    id: '1',
    title: 'Nuevas medidas de eficiencia energética',
    excerpt: 'Implementamos un nuevo sistema de gestión energética que reducirá nuestro consumo en un 30%',
    content: `
      <h2>Sistema de Gestión Energética Inteligente</h2>
      <p>Nos complace anunciar la implementación de un sistema de gestión energética de última generación en todas nuestras instalaciones.</p>
      
      <h3>Principales características:</h3>
      <ul>
        <li>Monitorización en tiempo real del consumo</li>
        <li>Ajuste automático de climatización según ocupación</li>
        <li>Optimización de horarios de iluminación</li>
        <li>Reportes mensuales de ahorro energético</li>
      </ul>
      
      <h3>Beneficios esperados:</h3>
      <ul>
        <li>Reducción del 30% en consumo eléctrico</li>
        <li>Menor huella de carbono</li>
        <li>Ahorro económico significativo</li>
        <li>Mayor confort para los empleados</li>
      </ul>
      
      <p>El sistema entrará en funcionamiento el 1 de febrero. Se realizarán sesiones de formación durante la próxima semana.</p>
    `,
    author: 'Director de Operaciones',
    authorRole: 'Dirección',
    createdAt: '2026-01-18T10:00:00Z',
    type: 'info',
    read: false,
    isNew: true,
    audience: 'all',
  },
  {
    id: '2',
    title: 'Formación obligatoria en primeros auxilios',
    excerpt: 'Todos los empleados deberán completar el curso de primeros auxilios antes del 28 de febrero',
    content: `
      <h2>Curso de Primeros Auxilios - Obligatorio</h2>
      <p>Como parte de nuestro compromiso con la seguridad laboral, hemos organizado sesiones de formación en primeros auxilios para todo el personal.</p>
      
      <h3>Información del curso:</h3>
      <ul>
        <li><strong>Duración:</strong> 4 horas</li>
        <li><strong>Modalidad:</strong> Presencial</li>
        <li><strong>Fecha límite:</strong> 28 de febrero de 2026</li>
        <li><strong>Certificación:</strong> Certificado oficial incluido</li>
      </ul>
      
      <h3>Contenidos:</h3>
      <ul>
        <li>RCP (Reanimación Cardiopulmonar)</li>
        <li>Actuación ante atragantamientos</li>
        <li>Tratamiento de heridas y quemaduras</li>
        <li>Protocolo de emergencias</li>
      </ul>
      
      <p>Por favor, inscríbanse en RRHH antes del 25 de enero para reservar su plaza.</p>
    `,
    author: 'Dpto. de Formación',
    authorRole: 'Formación y Desarrollo',
    createdAt: '2026-01-16T08:30:00Z',
    type: 'training',
    read: true,
    isNew: true,
    audience: 'all',
  },
  {
    id: '3',
    title: '⚠️ Importante: Actualización del sistema informático',
    excerpt: 'El sistema estará fuera de servicio el sábado 21 de enero de 02:00 a 06:00',
    content: `
      <h2>Mantenimiento Programado del Sistema</h2>
      <p><strong>Fecha:</strong> Sábado 21 de enero de 2026<br/>
      <strong>Horario:</strong> 02:00 - 06:00 (aprox.)<br/>
      <strong>Impacto:</strong> Sistema completamente inaccesible</p>
      
      <h3>Servicios afectados:</h3>
      <ul>
        <li>Plataforma web</li>
        <li>Aplicación móvil</li>
        <li>Sistema de fichaje</li>
        <li>Correo corporativo</li>
      </ul>
      
      <h3>Mejoras que se implementarán:</h3>
      <ul>
        <li>Mayor velocidad de carga</li>
        <li>Nuevas funcionalidades de reportes</li>
        <li>Mejoras de seguridad</li>
        <li>Interfaz optimizada</li>
      </ul>
      
      <p><strong>Nota:</strong> Recomendamos guardar todo el trabajo antes de las 01:45 del sábado.</p>
    `,
    author: 'Departamento IT',
    authorRole: 'Sistemas',
    createdAt: '2026-01-14T12:00:00Z',
    type: 'notice',
    read: true,
    isNew: false,
    audience: 'all',
  },
];
