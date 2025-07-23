-- Tabela principal de usuários
CREATE TABLE usuarios (
    id_usuarios SERIAL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hash_senha VARCHAR(100) NOT NULL, -- por favor não deixar senhas no banco
    tipo_usuario VARCHAR(20) NOT NULL,
    CONSTRAINT PK_usuarios PRIMARY KEY (id_usuarios)
);

-- Tabela de alunos
CREATE TABLE alunos (
    id_alunos SERIAL,
    usuario_id INTEGER NOT NULL,
    data_nascimento DATE,
    responsavel_nome VARCHAR(100),
    nome_pai VARCHAR(100),
    nome_mae VARCHAR(100),
    profissao_pai VARCHAR(100),
    profissao_mae VARCHAR(100),
    alergias VARCHAR(100),
    telefone_pai VARCHAR(16),
    telefone_mae VARCHAR(16),
    email_pai VARCHAR(100),
    email_mae VARCHAR(100),
    idade INTEGER, 
    religiao VARCHAR(50), -- Novo campo para religião
    CONSTRAINT PK_alunos PRIMARY KEY (id_alunos),
    CONSTRAINT FK_alunos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuarios)
);


-- Tabela de professores
CREATE TABLE professores (
    id_professores SERIAL,
    usuario_id INTEGER NOT NULL,
    disciplina_especialidade VARCHAR(100),
    CONSTRAINT PK_professores PRIMARY KEY (id_professores),
    CONSTRAINT FK_professores_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuarios)
);

-- Tabela de secretarias
CREATE TABLE secretaria (
    id_secretaria SERIAL,
    usuario_id INTEGER NOT NULL,
    CONSTRAINT PK_secretaria PRIMARY KEY (id_secretaria),
    CONSTRAINT FK_secretaria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuarios)
);

-- Tabela de turmas
CREATE TABLE turmas (
    id_turmas SERIAL,
    nome VARCHAR(50) NOT NULL,
    ano_letivo INTEGER,
    CONSTRAINT PK_turmas PRIMARY KEY (id_turmas)
);

-- Tabela de disciplinas (matérias)
CREATE TABLE materias (
    id_materias SERIAL,
    nome VARCHAR(100) NOT NULL,
    CONSTRAINT PK_materias PRIMARY KEY (id_materias)
);

-- Tabela de vínculo entre alunos e turmas
CREATE TABLE alunos_turmas (
    id_alunos_turmas SERIAL,
    aluno_id INTEGER,
    turma_id INTEGER,
    CONSTRAINT PK_alunos_turmas PRIMARY KEY (id_alunos_turmas),
    CONSTRAINT FK_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id_alunos),
    CONSTRAINT FK_turma FOREIGN KEY (turma_id) REFERENCES turmas(id_turmas)
);

-- Tabela de notas
CREATE TABLE notas (
    id_notas SERIAL,
    aluno_id INTEGER,
    materia_id INTEGER,
    turma_id INTEGER,
    nota DECIMAL(4,2),
    bimestre INTEGER,
    CONSTRAINT PK_notas PRIMARY KEY (id_notas),
    CONSTRAINT FK_nota_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id_alunos),
    CONSTRAINT FK_nota_materia FOREIGN KEY (materia_id) REFERENCES materias(id_materias),
    CONSTRAINT FK_nota_turma FOREIGN KEY (turma_id) REFERENCES turmas(id_turmas)
);

-- Tabela de faltas
CREATE TABLE faltas (
    id_faltas SERIAL,
    aluno_id INTEGER,
    materia_id INTEGER,
    data_falta DATE,
    CONSTRAINT PK_faltas PRIMARY KEY (id_faltas),
    CONSTRAINT FK_falta_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id_alunos),
    CONSTRAINT FK_falta_materia FOREIGN KEY (materia_id) REFERENCES materias(id_materias)
);

-- Tabela de recados
CREATE TABLE recados (
    id_recados SERIAL,
    titulo VARCHAR(100),
    mensagem TEXT,
    data_envio DATE DEFAULT CURRENT_DATE,
    professor_id INTEGER,
    turma_id INTEGER,
    CONSTRAINT PK_recados PRIMARY KEY (id_recados),
    CONSTRAINT FK_recado_professor FOREIGN KEY (professor_id) REFERENCES professores(id_professores),
    CONSTRAINT FK_recado_turma FOREIGN KEY (turma_id) REFERENCES turmas(id_turmas)
);

-- Tabela de tarefas
CREATE TABLE tarefas (
    id_tarefas SERIAL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_entrega DATE,
    professor_id INTEGER,
    turma_id INTEGER,
    materia_id INTEGER,
    CONSTRAINT PK_tarefas PRIMARY KEY (id_tarefas),
    CONSTRAINT FK_tarefas_professor FOREIGN KEY (professor_id) REFERENCES professores(id_professores),
    CONSTRAINT FK_tarefas_turma FOREIGN KEY (turma_id) REFERENCES turmas(id_turmas),
    CONSTRAINT FK_tarefas_materia FOREIGN KEY (materia_id) REFERENCES materias(id_materias)
);

-- Tabela de entregas de tarefas
CREATE TABLE entregas_tarefas (
    id_entregas_tarefas SERIAL,
    tarefa_id INTEGER,
    aluno_id INTEGER,
    data_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    conteudo TEXT,
    nota DECIMAL(4,2),
    CONSTRAINT PK_entregas_tarefas PRIMARY KEY (id_entregas_tarefas),
    CONSTRAINT FK_entregas_tarefa FOREIGN KEY (tarefa_id) REFERENCES tarefas(id_tarefas),
    CONSTRAINT FK_entregas_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id_alunos)
);

-- Tabela de materiais didáticos
CREATE TABLE materiais_didaticos (
    id_materiais_didaticos SERIAL,
    titulo VARCHAR(100),
    descricao TEXT,
    link_arquivo TEXT,
    professor_id INTEGER,
    turma_id INTEGER,
    materia_id INTEGER,
    CONSTRAINT PK_materiais_didaticos PRIMARY KEY (id_materiais_didaticos),
    CONSTRAINT FK_materiais_professor FOREIGN KEY (professor_id) REFERENCES professores(id_professores),
    CONSTRAINT FK_materiais_turma FOREIGN KEY (turma_id) REFERENCES turmas(id_turmas),
    CONSTRAINT FK_materiais_materia FOREIGN KEY (materia_id) REFERENCES materias(id_materias)
);

-- Tabela de horários de aulas
CREATE TABLE horarios_aulas (
    id_horarios_aulas SERIAL,
    turma_id INTEGER,
    materia_id INTEGER,
    professor_id INTEGER,
    dia_semana VARCHAR(10),
    horario_inicio TIME,
    horario_fim TIME,
    CONSTRAINT PK_horarios_aulas PRIMARY KEY (id_horarios_aulas),
    CONSTRAINT FK_horarios_turma FOREIGN KEY (turma_id) REFERENCES turmas(id_turmas),
    CONSTRAINT FK_horarios_materia FOREIGN KEY (materia_id) REFERENCES materias(id_materias),
    CONSTRAINT FK_horarios_professor FOREIGN KEY (professor_id) REFERENCES professores(id_professores)
);

-- Tabela de avisos gerais
CREATE TABLE avisos_gerais (
    id_avisos_gerais SERIAL,
    titulo VARCHAR(100),
    mensagem TEXT,
    data_envio DATE DEFAULT CURRENT_DATE,
    autor_id INTEGER,
    CONSTRAINT PK_avisos_gerais PRIMARY KEY (id_avisos_gerais),
    CONSTRAINT FK_avisos_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id_usuarios)
);

-- Tabela de ocorrências (observações/disciplinares)
CREATE TABLE ocorrencias (
    id_ocorrencias SERIAL,
    aluno_id INTEGER,
    data_ocorrencia DATE,
    descricao TEXT,
    registrada_por INTEGER,
    CONSTRAINT PK_ocorrencias PRIMARY KEY (id_ocorrencias),
    CONSTRAINT FK_ocorrencia_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id_alunos),
    CONSTRAINT FK_ocorrencia_usuario FOREIGN KEY (registrada_por) REFERENCES usuarios(id_usuarios)
);
