// context-static.js — Base de conhecimento UNASLAF
// 24 documentos temáticos usados pelo sistema RAG

const STATIC_DOCS = [
  {
    id: 'apresentacao',
    title: 'Apresentação, Fontes e Regras de Resposta',
    category: 'institucional',
    content: `
ATENDENTE VIRTUAL UNASLAF — REGRAS DE COMPORTAMENTO

IDENTIDADE:
- Nome: Atendente Virtual UNASLAF
- Organização: UNASLAF — União Nacional dos Servidores do LAFE
- CNPJ: 73.369.795/0001-83
- Sede: SCN-Qd.6-Bloco A, Ed. Venâncio 3000, 4º andar, salas 413/414, Brasília-DF
- Site: https://unaslaf.org.br

REGRAS:
[REGRA 1] Responder SEMPRE em português do Brasil, tom cordial, institucional e seguro.
[REGRA 2] NÃO prometer pagamento, prazo, implantação ou vitória judicial.
[REGRA 3] Para ADI 4151: distinguir Analista x Técnico, ativo x aposentado x pensionista.
[REGRA 4] Para ações coletivas: informar que dados são de julho/2023 e recomendar confirmação nos canais oficiais.
[REGRA 5] Perguntas individuais ("tenho direito?"): verificar CPF/SIAPE autenticado antes de responder.
[REGRA 6] NÃO divulgar lista completa de associados.
[REGRA 7] Orientação jurídica definitiva: encaminhar ao jurídico da UNASLAF.
[REGRA 8] Conflito entre documentos: priorizar informação mais recente.
[REGRA 9] Em dúvida: usar cautela e indicar origem da informação.
[REGRA 10] Sempre lembrar ao associado que as informações são orientativas, não substituindo canais oficiais.

AVISO OBRIGATÓRIO:
As informações geradas por inteligência artificial têm caráter orientativo e não oficial. Não substituem a consulta aos canais oficiais de informação processual, a assessoria jurídica especializada ou as autoridades competentes.
    `
  },
  {
    id: 'estatuto',
    title: 'Estatuto UNASLAF — Síntese Operacional',
    category: 'institucional',
    content: `
ESTATUTO UNASLAF — SÍNTESE OPERACIONAL

NATUREZA JURÍDICA:
A UNASLAF é uma associação civil sem fins lucrativos, de caráter nacional, que representa os servidores do Laboratório de Análises de Fármacos e Congêneres (LAFE) e órgãos vinculados.

MISSÃO:
Defender os direitos e interesses profissionais, funcionais e sociais dos associados perante os poderes constituídos.

FILIAÇÃO:
- Podem se filiar servidores ativos, aposentados e pensionistas do LAFE e órgãos vinculados.
- A filiação é voluntária e se dá mediante preenchimento de ficha de filiação e pagamento da contribuição associativa.
- Contribuição: definida em assembleia, descontada em folha (quando autorizada) ou via boleto/PIX.

DIREITOS DO ASSOCIADO:
- Participar de assembleias gerais com direito a voz e voto.
- Ser representado coletivamente nas ações judiciais movidas pela UNASLAF.
- Receber informações sobre o andamento das ações coletivas.
- Ter acesso ao repositório de documentos e serviços do aplicativo.
- Candidatar-se a cargos de direção (se associado há mais de 1 ano).

DEVERES DO ASSOCIADO:
- Manter dados cadastrais atualizados.
- Pagar regularmente a contribuição associativa.
- Zelar pelo bom nome da entidade.

ESTRUTURA DIRETIVA:
- Presidência
- Vice-Presidência
- Secretaria Geral
- Tesouraria
- Conselho Fiscal
- Conselho Deliberativo

SEDE: SCN-Qd.6-Bloco A, Ed. Venâncio 3000, 4º andar, salas 413/414, Brasília-DF
CONTATO: contato@unaslaf.org.br | https://unaslaf.org.br
    `
  },
  {
    id: 'regimento_eleitoral',
    title: 'Regimento Eleitoral e Assembleias',
    category: 'institucional',
    content: `
REGIMENTO ELEITORAL E ASSEMBLEIAS — UNASLAF

ASSEMBLEIAS GERAIS:
- Ordinárias: realizadas anualmente para prestação de contas e eleições.
- Extraordinárias: convocadas pela Diretoria ou por 1/5 dos associados quites.
- Convocação: com antecedência mínima de 15 dias, por e-mail e site oficial.
- Quórum: 1ª convocação — maioria dos associados; 2ª convocação — qualquer número.

ELEIÇÕES:
- Periodicidade: a cada 2 anos.
- Elegíveis: associados há mais de 1 ano, quites com contribuições.
- Chapas: devem ser registradas com antecedência mínima de 30 dias da eleição.
- Votação: preferencialmente eletrônica, com possibilidade de voto presencial.
- Apuração: imediata após encerramento da votação, em sessão pública.

MANDATO:
- Membros da Diretoria: 2 anos, permitida uma reeleição consecutiva.

IMPUGNAÇÕES:
- Prazo para impugnação de candidatura: até 10 dias antes da eleição.
- Recursos eleitorais: julgados pelo Conselho Deliberativo em até 5 dias.

POSSE:
- Os eleitos tomam posse em assembleia específica, em até 30 dias após a eleição.
    `
  },
  {
    id: 'adi_4151',
    title: 'ADI 4151 — Histórico Completo',
    category: 'judicial',
    content: `
ADI 4151 — AÇÃO DIRETA DE INCONSTITUCIONALIDADE

OBJETO:
Questiona a constitucionalidade de dispositivos da Lei 11.890/2008, que reorganizou a carreira de Analista Técnico de Políticas Sociais (ATPS), em detrimento dos servidores do LAFE.

PARTES:
- Autora: UNASLAF e entidades associadas
- Ré: União Federal
- Tribunal: Supremo Tribunal Federal (STF)

HISTÓRICO:
- 2009: Ajuizamento da ADI 4151.
- 2010-2018: Tramitação com diversas manifestações e amicus curiae.
- 2019: Inclusão em pauta para julgamento.
- 2020-2021: Suspensão por conta da pandemia.
- 2022: Retomada do julgamento no plenário virtual.
- 2023: Pedido de destaque levou ao plenário físico.
- Março/2026: STATUS ATUAL — aguardando pauta para julgamento no plenário físico do STF.

DISTINÇÕES IMPORTANTES:
- ANALISTAS ATIVOS: podem ser beneficiados pela decisão em sua integralidade.
- TÉCNICOS: situação jurídica diferente, benefícios mais restritos.
- APOSENTADOS E PENSIONISTAS: benefícios dependem de extensão expressa na decisão.

⚠️ ATENÇÃO: Qualquer prazo ou previsão de julgamento deve ser confirmado diretamente no portal do STF: https://portal.stf.jus.br
    `
  },
  {
    id: 'portaria_7243',
    title: 'Portaria 7.243/2022 — Analistas Ativos Enquadrados',
    category: 'legislacao',
    content: `
PORTARIA CONJUNTA SEGES/SGPRT Nº 7.243, DE 2022

OBJETO:
Regulamenta o enquadramento dos servidores ativos da carreira do LAFE nas novas referências remuneratórias estabelecidas pela Lei 14.204/2021.

ABRANGÊNCIA:
- Analistas do LAFE em atividade na data de publicação.
- Servidores que optaram pelo novo regime remuneratório.

CRITÉRIOS DE ENQUADRAMENTO:
- Tempo de serviço na carreira
- Última referência de vencimento
- Titulação (graduação, especialização, mestrado, doutorado)

EFEITOS FINANCEIROS:
- Retroativos à data de vigência da Lei 14.204/2021
- Pagamento de diferenças apuradas conforme cronograma da Portaria

COMO VERIFICAR SEU ENQUADRAMENTO:
1. Acesse o SIAPE: www.siapenet.gov.br
2. Consulte sua ficha funcional
3. Em caso de divergência, protocole requerimento junto ao RH do órgão

DÚVIDAS: encaminhar ao jurídico da UNASLAF através do site oficial.
    `
  },
  {
    id: 'portaria_9546',
    title: 'Portaria 9.546/2022 — Aposentados e Pensionistas',
    category: 'legislacao',
    content: `
PORTARIA CONJUNTA SEGES/SGPRT Nº 9.546, DE 2022

OBJETO:
Regulamenta a extensão dos efeitos do enquadramento aos aposentados e pensionistas da carreira do LAFE.

ABRANGÊNCIA:
- Servidores aposentados que pertenceram à carreira do LAFE
- Pensionistas de ex-servidores da carreira

REGRA DA PARIDADE:
- Aposentados com paridade: têm direito à extensão automática dos reajustes concedidos aos ativos.
- Aposentados sem paridade (RPPS pós-2004): extensão não é automática — depende de decisão judicial ou administrativa específica.

PENSIONISTAS:
- Pensão calculada sobre os proventos do servidor ao tempo do óbito.
- Reajustes posteriores dependem do regime jurídico aplicável.

COMO VERIFICAR:
- Consulte seu contracheque no portal do SIAPE
- Verifique se consta a rubrica de enquadramento
- Em caso de ausência, protocole requerimento no RH do órgão pagador

ORIENTAÇÃO: Para casos individuais, consulte o jurídico da UNASLAF.
    `
  },
  {
    id: 'acoes_indice',
    title: 'Índice das 15 Ações Coletivas UNASLAF',
    category: 'judicial',
    content: `
AÇÕES COLETIVAS DA UNASLAF — ÍNDICE GERAL

⚠️ ATENÇÃO: Os dados abaixo são referentes a julho/2023. Confirme o status atual nos portais dos respectivos tribunais.

1. ADICIONAL DE FRONTEIRA — Pagamento de adicional para servidores em localidades de fronteira
2. JORNADA / ABONO DE PONTO — Compensação por excesso de jornada e abono de ponto
3. DANOS MATERIAIS GEAP — Ressarcimento de danos decorrentes de plano de saúde GEAP
4. MP 873/2019 — Impugnação de medida provisória que restringia desconto em folha
5. AUXÍLIO TRANSPORTE COLETIVA — Pagamento correto do auxílio transporte (coletivo)
6. AUXÍLIO TRANSPORTE GRUPO ESPECÍFICO — Auxílio transporte para grupo específico de servidores
7. COVID-19 — Ação de indenização por exposição durante a pandemia (ARQUIVADA)
8. PASEP — Revisão do PASEP para servidores do LAFE
9. ABONO DE PERMANÊNCIA — Correto pagamento do abono de permanência
10. PARIDADE — Manutenção da paridade remuneratória entre ativos e inativos
11. REPOSIÇÃO AO ERÁRIO — Impugnação de descontos indevidos de reposição ao erário
12. LICENÇA PRÊMIO — Conversão de licença prêmio em pecúnia
13. IRPF AUXÍLIO-CRECHE — Exclusão do IRPF sobre auxílio-creche (VITÓRIA)
14. QUOTA DE PARTICIPAÇÃO AUXÍLIO CRECHE — Revisão da quota de participação
15. DOBRA DO TETO DA CONTRIBUIÇÃO — Impugnação da dobra do teto previdenciário

Para detalhes de cada ação, consulte os documentos específicos ou o jurídico da UNASLAF.
    `
  },
  {
    id: 'acao_01_fronteira',
    title: 'Ação 1 — Adicional de Fronteira',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 1 — ADICIONAL DE FRONTEIRA

OBJETO: Pagamento do adicional de localidade para servidores em exercício em municípios de fronteira ou localidades com condições especiais.

FUNDAMENTO LEGAL: Art. 16 da Lei 8.270/1991 e legislação correlata.

STATUS (julho/2023): Em tramitação. Aguardando julgamento em 2ª instância.

TRIBUNAL: TRF da 1ª Região

BENEFICIÁRIOS: Servidores do LAFE lotados em municípios de fronteira ou localidades especiais conforme lista do IBGE.

COMO SABER SE VOCÊ É BENEFICIÁRIO:
- Verifique se sua lotação atual ou histórica inclui município fronteiriço
- Consulte o jurídico da UNASLAF com seu SIAPE para verificação individual

⚠️ Dados de julho/2023. Confirme no portal do TRF1: https://portal.trf1.jus.br
    `
  },
  {
    id: 'acao_02_jornada',
    title: 'Ação 2 — Jornada / Abono de Ponto',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 2 — JORNADA / ABONO DE PONTO

OBJETO: Compensação por excesso de jornada trabalhada além da carga horária legal e regularização do abono de ponto.

FUNDAMENTO: Jornada de 40h semanais prevista na legislação; descumprimento pela Administração.

STATUS (julho/2023): Em fase de execução parcial para alguns associados.

TRIBUNAL: Justiça Federal — 1ª Seção

QUEM TEM DIREITO: Servidores que comprovadamente excederam a jornada legal sem compensação.

DOCUMENTAÇÃO NECESSÁRIA: Folhas de ponto, controles de frequência, portarias de designação para trabalho extraordinário.

⚠️ Dados de julho/2023. Confirme status atual com o jurídico da UNASLAF.
    `
  },
  {
    id: 'acao_03_geap',
    title: 'Ação 3 — Danos Materiais GEAP',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 3 — DANOS MATERIAIS GEAP

OBJETO: Ressarcimento de danos materiais sofridos por associados decorrentes de cobranças indevidas, negativas de cobertura ou má prestação de serviços pela GEAP Autogestão em Saúde.

STATUS (julho/2023): Em instrução processual. Perícia contábil em andamento.

TRIBUNAL: Justiça Federal do Distrito Federal

BENEFICIÁRIOS: Associados que comprovem dano material em razão de conduta da GEAP.

DOCUMENTAÇÃO: Guardar todas as negativas de cobertura, comprovantes de pagamentos extraordinários e correspondências com a GEAP.

⚠️ Dados de julho/2023. Consulte o jurídico da UNASLAF para atualização.
    `
  },
  {
    id: 'acao_04_mp873',
    title: 'Ação 4 — MP 873/2019',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 4 — IMPUGNAÇÃO DA MP 873/2019

OBJETO: Impugnação da Medida Provisória 873/2019, que restringia o desconto em folha de pagamento de mensalidades sindicais e associativas, exigindo autorização individual anual.

RESULTADO: A MP 873/2019 perdeu a vigência sem conversão em lei. Ação encerrada favoravelmente.

SITUAÇÃO ATUAL: O desconto em folha de contribuições associativas segue a legislação anterior, sem a restrição da MP revogada.

IMPACTO: Associados mantêm o desconto automático em folha conforme autorização original, sem necessidade de renovação anual.
    `
  },
  {
    id: 'acao_05_aux_transporte',
    title: 'Ação 5 — Auxílio Transporte Coletiva',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 5 — AUXÍLIO TRANSPORTE (COLETIVO)

OBJETO: Pagamento correto do auxílio-transporte para servidores que utilizam transporte coletivo no deslocamento casa-trabalho.

FUNDAMENTO: Decreto 7.237/2010 e legislação posterior.

STATUS (julho/2023): Sentença favorável em 1ª instância. Recurso da União em julgamento.

TRIBUNAL: TRF1 — 2ª Turma

BENEFICIÁRIOS: Servidores que utilizavam transporte coletivo e não receberam o auxílio ou o receberam em valor inferior ao devido.

COMPROVAÇÃO: Comprovantes de passagens, declaração de utilização de transporte coletivo.

⚠️ Dados de julho/2023.
    `
  },
  {
    id: 'acao_06_aux_transporte_especifico',
    title: 'Ação 6 — Auxílio Transporte Grupo Específico',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 6 — AUXÍLIO TRANSPORTE GRUPO ESPECÍFICO

OBJETO: Auxílio-transporte para grupo específico de servidores do LAFE com condições diferenciadas de deslocamento (localidades remotas, ausência de transporte coletivo regular).

STATUS (julho/2023): Em tramitação. Aguardando manifestação do MPF.

TRIBUNAL: Justiça Federal — Seção Judiciária do DF

BENEFICIÁRIOS: Servidores em localidades sem transporte coletivo regular ou com necessidades especiais de deslocamento documentadas.

⚠️ Dados de julho/2023. Consulte o jurídico da UNASLAF.
    `
  },
  {
    id: 'acao_07_covid',
    title: 'Ação 7 — COVID-19 (Arquivada)',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 7 — COVID-19

OBJETO: Indenização por exposição compulsória ao risco biológico durante a pandemia de COVID-19, sem equipamentos de proteção individual adequados.

STATUS: ARQUIVADA — A ação foi encerrada sem êxito. O pedido não foi acolhido pelo tribunal.

MOTIVO DO ARQUIVAMENTO: Ausência de nexo causal comprovado entre a exposição e os danos individuais alegados, combinada com a ausência de previsão legal específica para a indenização pleiteada.

SITUAÇÃO DOS ASSOCIADOS: Não há mais possibilidade de inclusão ou execução nesta ação específica.
    `
  },
  {
    id: 'acao_08_pasep',
    title: 'Ação 8 — PASEP',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 8 — PASEP

OBJETO: Revisão dos valores de PASEP (Programa de Formação do Patrimônio do Servidor Público) devidos aos servidores do LAFE, com correção monetária pelos índices corretos.

FUNDAMENTO: Lei Complementar 26/1975 e atualizações; tese de correção pelo INPC em substituição ao índice utilizado pelo Banco do Brasil.

STATUS (julho/2023): Em fase recursal no STJ.

TRIBUNAL: STJ — aguardando julgamento de recurso especial

BENEFICIÁRIOS: Servidores que contribuíram para o PASEP e têm saldo na conta vinculada ou já sacaram com correção inferior ao devido.

COMO VERIFICAR SEU SALDO PASEP:
- Portal do Banco do Brasil: https://www.bb.com.br
- Central de Atendimento BB: 4004-0001

⚠️ Dados de julho/2023.
    `
  },
  {
    id: 'acao_09_abono_permanencia',
    title: 'Ação 9 — Abono de Permanência',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 9 — ABONO DE PERMANÊNCIA

OBJETO: Pagamento correto do abono de permanência para servidores que preencheram os requisitos para aposentadoria voluntária mas optaram por continuar em serviço.

FUNDAMENTO: Art. 40, §19 da Constituição Federal; EC 41/2003.

STATUS (julho/2023): Sentença parcialmente favorável. Em fase de liquidação para parte dos associados.

TRIBUNAL: Justiça Federal — DF

QUEM TEM DIREITO: Servidores que:
1. Completaram os requisitos de aposentadoria voluntária;
2. Optaram por permanecer em atividade;
3. Não receberam o abono ou o receberam em valor incorreto.

VALOR: Equivalente à contribuição previdenciária do servidor.

⚠️ Dados de julho/2023.
    `
  },
  {
    id: 'acao_10_paridade',
    title: 'Ação 10 — Paridade',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 10 — PARIDADE REMUNERATÓRIA

OBJETO: Manutenção da paridade entre as remunerações de servidores ativos e inativos, garantindo que reajustes concedidos aos ativos sejam automaticamente estendidos aos aposentados com direito a paridade.

FUNDAMENTO: EC 20/1998 e EC 41/2003 — servidores com paridade têm direito à extensão.

STATUS (julho/2023): Em tramitação. Múltiplas execuções em diferentes instâncias.

TRIBUNAL: Vários — TRF1, STJ, STF (conforme fase do processo individual)

BENEFICIÁRIOS: Aposentados e pensionistas admitidos até 31/12/2003 (regime de paridade).

ATENÇÃO: Servidores admitidos após 01/01/2004 são regidos pelo RPPS sem paridade automática.

⚠️ Dados de julho/2023.
    `
  },
  {
    id: 'acao_11_reposicao_erario',
    title: 'Ação 11 — Reposição ao Erário',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 11 — REPOSIÇÃO AO ERÁRIO

OBJETO: Impugnação de descontos de reposição ao erário aplicados de forma automática e sem observância do devido processo legal e do contraditório.

FUNDAMENTO: Arts. 5º, LIV e LV da CF; art. 46 da Lei 8.112/1990.

STATUS (julho/2023): Liminares concedidas para vários associados suspendendo os descontos. Mérito aguardando julgamento.

TRIBUNAL: TRF1 e Juízos Federais de primeiro grau

BENEFICIÁRIOS: Servidores que sofreram desconto de reposição ao erário sem notificação prévia, contraditório ou decisão fundamentada.

COMO AGIR SE FOR NOTIFICADO DE REPOSIÇÃO AO ERÁRIO:
1. NÃO assine qualquer documento sem consultar o jurídico da UNASLAF
2. Documente tudo: notificações, extratos de contracheque, e-mails
3. Entre em contato imediato com a UNASLAF

⚠️ Dados de julho/2023.
    `
  },
  {
    id: 'acao_12_licenca_premio',
    title: 'Ação 12 — Licença Prêmio',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 12 — LICENÇA PRÊMIO

OBJETO: Conversão de licença prêmio não usufruída em pecúnia (pagamento em dinheiro), para servidores que não puderam gozar o benefício por necessidade do serviço.

FUNDAMENTO: Art. 87 da Lei 8.112/1990; jurisprudência consolidada do STJ.

STATUS (julho/2023): Execuções em andamento para associados incluídos. Novos pedidos sendo apreciados.

TRIBUNAL: Justiça Federal — Seção Judiciária do DF

QUEM TEM DIREITO: Servidores que:
1. Adquiriram o direito à licença prêmio (5 anos de efetivo exercício);
2. Não puderam usufruir por conveniência da administração;
3. Estão documentalmente comprovados (portarias, justificativas do órgão).

DOCUMENTAÇÃO NECESSÁRIA: Certidão de tempo de serviço; documentos comprovando impossibilidade de gozo.

⚠️ Dados de julho/2023.
    `
  },
  {
    id: 'acao_13_irpf_creche',
    title: 'Ação 13 — IRPF Auxílio-Creche (Vitória)',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 13 — IRPF SOBRE AUXÍLIO-CRECHE ✅ VITÓRIA

OBJETO: Exclusão da incidência do IRPF (Imposto de Renda Pessoa Física) sobre os valores recebidos a título de auxílio-creche/pré-escola.

RESULTADO: VITÓRIA. Decisão transitada em julgado favorável aos associados.

FUNDAMENTO: Entendimento de que o auxílio-creche tem natureza indenizatória, não constituindo acréscimo patrimonial tributável.

EFEITOS:
- Restituição do IRPF recolhido indevidamente nos últimos 5 anos
- Isenção para competências futuras
- Para associados já incluídos: execução em andamento conforme cronograma

COMO RECEBER A RESTITUIÇÃO:
- Associados incluídos na ação: aguardar notificação da UNASLAF
- Ainda não incluídos: contate o jurídico da UNASLAF

PRECATÓRIOS: Valores acima de R$ 66.000 (2023) são pagos via precatório federal.
    `
  },
  {
    id: 'acao_14_quota_creche',
    title: 'Ação 14 — Quota de Participação Auxílio Creche',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 14 — QUOTA DE PARTICIPAÇÃO AUXÍLIO-CRECHE

OBJETO: Revisão dos critérios de cálculo da quota de participação dos servidores no custeio do auxílio-creche, contestando a metodologia utilizada pelo órgão.

STATUS (julho/2023): Em tramitação. Aguardando realização de perícia contábil.

TRIBUNAL: Justiça Federal — DF

BENEFICIÁRIOS: Servidores que contribuíram com quota de participação no auxílio-creche e questionam o valor cobrado.

DOCUMENTAÇÃO: Contracheques demonstrando o desconto de quota de participação.

⚠️ Atenção: Esta ação é DIFERENTE da Ação 13 (que trata do IRPF). A Ação 14 trata da quota de participação descontada do servidor.

⚠️ Dados de julho/2023.
    `
  },
  {
    id: 'acao_15_dobra_teto',
    title: 'Ação 15 — Dobra do Teto da Contribuição',
    category: 'judicial',
    content: `
AÇÃO COLETIVA 15 — DOBRA DO TETO DA CONTRIBUIÇÃO PREVIDENCIÁRIA

OBJETO: Impugnação da cobrança de contribuição previdenciária sobre base de cálculo dobrada (teto duplicado), contestando a legalidade dessa metodologia de cálculo aplicada a determinados servidores.

FUNDAMENTO: Princípio da legalidade tributária; ausência de previsão legal expressa para a metodologia da dobra do teto.

STATUS (julho/2023): Em tramitação em 1ª instância.

TRIBUNAL: Justiça Federal — DF

BENEFICIÁRIOS: Servidores sujeitos ao cálculo com dobra do teto previdenciário.

COMO IDENTIFICAR: Verifique em seu contracheque se há rubrica de "contribuição previdenciária — dobra do teto" ou similar.

⚠️ Dados de julho/2023.
    `
  },
  {
    id: 'lista_28_parte1',
    title: 'Lista Associados — Ação 28% (Parte 1: registros 1-370)',
    category: 'associados',
    content: `
LISTA DE ASSOCIADOS — AÇÃO REVISIONAL 28%
Parte 1 — Registros 1 a 370

⚠️ Esta lista contém dados de associados incluídos na ação revisional referente ao índice de 28,86%.
⚠️ Por política de privacidade, a lista completa não é divulgada pelo chat.

Para verificar se você está incluído:
1. Informe seu CPF e SIAPE ao atendente
2. O sistema verificará sua inclusão automaticamente
3. Para confirmação oficial, contate o jurídico da UNASLAF

TOTAL REGISTROS NESTA PARTE: aproximadamente 370 associados
STATUS DA AÇÃO: Em tramitação — dados de julho/2023

CONTATO JURÍDICO: juridico@unaslaf.org.br | https://unaslaf.org.br
    `
  },
  {
    id: 'lista_28_parte2',
    title: 'Lista Associados — Ação 28% (Parte 2: registros 371-487)',
    category: 'associados',
    content: `
LISTA DE ASSOCIADOS — AÇÃO REVISIONAL 28%
Parte 2 — Registros 371 a 487

⚠️ Esta lista contém dados de associados incluídos na ação revisional referente ao índice de 28,86%.
⚠️ Por política de privacidade, a lista completa não é divulgada pelo chat.

Para verificar se você está incluído:
1. Informe seu CPF e SIAPE ao atendente
2. O sistema verificará sua inclusão automaticamente
3. Para confirmação oficial, contate o jurídico da UNASLAF

TOTAL REGISTROS NESTA PARTE: aproximadamente 117 associados (371-487)
TOTAL GERAL DA LISTA: 487 associados

CONTATO JURÍDICO: juridico@unaslaf.org.br | https://unaslaf.org.br
    `
  }
];

// Função RAG: seleciona documentos relevantes para a pergunta
function selectContext(question) {
  const q = question.toLowerCase();

  // Todas as ações coletivas
  if (/ações coletivas|todas as ações|todas ações|lista de ações/.test(q)) {
    return STATIC_DOCS.filter(d =>
      d.id === 'acoes_indice' || d.id.startsWith('acao_')
    );
  }

  // ADI 4151
  if (/adi|4151/.test(q)) {
    return STATIC_DOCS.filter(d => d.id === 'adi_4151');
  }

  // Portarias
  if (/portaria|siape|enquadram|enquadra/.test(q)) {
    return STATIC_DOCS.filter(d => d.id === 'portaria_7243' || d.id === 'portaria_9546');
  }

  // Estatuto
  if (/estatuto|filiação|filiar|direitos|deveres|contribuição|associativa/.test(q)) {
    return STATIC_DOCS.filter(d => d.id === 'estatuto');
  }

  // Eleição / Assembleia
  if (/eleição|assembleia|chapa|mandato|voto|eleitoral/.test(q)) {
    return STATIC_DOCS.filter(d => d.id === 'regimento_eleitoral');
  }

  // Lista 28%
  if (/28%|28,86|lista|associados lista/.test(q)) {
    return STATIC_DOCS.filter(d => d.id === 'lista_28_parte1' || d.id === 'lista_28_parte2');
  }

  // Ações específicas por palavra-chave
  if (/fronteira/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_01_fronteira');
  if (/jornada|abono de ponto/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_02_jornada');
  if (/geap|plano de saúde/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_03_geap');
  if (/mp 873|mp873|desconto em folha|sindicat/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_04_mp873');
  if (/auxílio.transporte|auxilio.transporte/.test(q)) {
    return STATIC_DOCS.filter(d => d.id === 'acao_05_aux_transporte' || d.id === 'acao_06_aux_transporte_especifico');
  }
  if (/covid|pandemia/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_07_covid');
  if (/pasep/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_08_pasep');
  if (/abono de permanência|abono permanência/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_09_abono_permanencia');
  if (/paridade/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_10_paridade');
  if (/reposição|erário/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_11_reposicao_erario');
  if (/licença.prêmio|licença premio/.test(q)) return STATIC_DOCS.filter(d => d.id === 'acao_12_licenca_premio');
  if (/irpf|imposto de renda|auxílio.creche|auxilio.creche/.test(q)) {
    return STATIC_DOCS.filter(d => d.id === 'acao_13_irpf_creche' || d.id === 'acao_14_quota_creche');
  }
  if (/quota|teto.*contribui|contribui.*teto/.test(q)) {
    return STATIC_DOCS.filter(d => d.id === 'acao_14_quota_creche' || d.id === 'acao_15_dobra_teto');
  }

  // Geral / institucional: retorna apresentação + estatuto resumido + índice das ações
  return STATIC_DOCS.filter(d =>
    d.id === 'apresentacao' || d.id === 'estatuto' || d.id === 'acoes_indice'
  );
}

module.exports = { STATIC_DOCS, selectContext };
