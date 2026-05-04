// Contexto estático da UNASLAF — 25 documentos temáticos
// Carregado em memória, zero latência, sem chamadas ao Drive

export const UNASLAF_DOCS = [
  {
    id: "apresentacao_regras",
    title: "Apresentação, Fontes e Regras",
    category: "regras",
    content: `BASE DE CONTEXTO E PESQUISA – UNASLAF

FINALIDADE: alimentar base de conhecimento de agente virtual com IA para atendimento institucional da UNASLAF.

POLÍTICA DE DADOS: Foram excluídos dados pessoais de endereço e documentos de identificação. Foram mantidos nome, CPF e matrícula SIAPE. A IA não deve dar parecer jurídico definitivo. Status processuais atualizados até julho/2023 — para andamento atual consultar PJe/eproc/STF/STJ.

REGRAS DE RESPOSTA:
[REGRA 1] Responder em português do Brasil, tom cordial, institucional e seguro.
[REGRA 2] Não prometer pagamento, prazo, implantação ou vitória judicial.
[REGRA 3] Quando o tema for ADI 4151, distinguir: Analista do Seguro Social, Técnico do Seguro Social, ativos, aposentados, pensionistas, redistribuídos e optantes pelo retorno ao INSS.
[REGRA 4] Quando o tema for ação coletiva, informar que a resposta tem base no relatório de julho/2023 e recomendar confirmação do andamento atual.
[REGRA 5] Quando houver pergunta individual ("tenho direito?", "estou na lista?"), verificar CPF/SIAPE autenticado.
[REGRA 6] Não divulgar lista completa de associados. Usar apenas para consulta interna.
[REGRA 7] Se o usuário pedir orientação jurídica definitiva: "Essa análise depende da verificação documental individual e deve ser encaminhada ao jurídico da UNASLAF."
[REGRA 9] Se houver conflito entre documento antigo e informação posterior, priorizar informação mais recente validada pela Diretoria/Jurídico.
[REGRA 10] Em dúvida: "Com base nos documentos disponíveis..." ou "O documento analisado indica...".`
  },
  {
    id: "estatuto",
    title: "Estatuto UNASLAF",
    category: "estatuto",
    content: `ESTATUTO UNASLAF – BASE OPERACIONAL

1. NATUREZA: A UNASLAF é associação nacional, pessoa jurídica de direito privado, sem fins econômicos, duração indeterminada, jurisdição nacional. CNPJ 73.369.795/0001-83. Sede: SCN-Qd.6-Bloco A, Ed. Venâncio 3000, 4º andar, salas 413/414, Brasília-DF.

2. PRERROGATIVAS: Representar associados perante poderes públicos; atuar judicial e extrajudicialmente como substituta processual; defender democracia e direitos humanos.

3. OBJETIVOS: Congregar servidores da extinta Secretaria da Receita Previdenciária (ativos e inativos); defender interesses perante autoridades; promover unidade e desenvolvimento social.

4. ASSOCIADOS:
- Associado natural: servidor em efetivo exercício na Receita Previdenciária em 16/03/2007.
- Associado participante: pensionista dos servidores indicados.
- Não podem associar-se: ocupantes do cargo de Auditor-Fiscal da Previdência Social.

5. DIREITOS: Participar de Convenções Nacionais; votar e ser votado; recorrer de atos lesivos; utilizar serviços e benefícios.

6. DEVERES: Cumprir Estatuto; contribuir com mensalidades; zelar pela imagem da UNASLAF.

7. SANÇÕES: Advertência, multa (até 5x mensalidade), perda de mandato, exclusão do quadro social.

8. ÓRGÃOS: Assembleia Geral (órgão máximo), Conselho Executivo, Conselho Fiscal, Conselho de Ética.

9. CONSELHO EXECUTIVO: Presidente, Vice-Presidente, Diretor de Finanças, Diretor de Política de Classe, Diretor de Comunicação Social, Diretor de Assuntos Jurídicos, Diretor de Assuntos Parlamentares, Diretor de Inativos.`
  },
  {
    id: "regimento_eleitoral",
    title: "Regimento Eleitoral",
    category: "regimento",
    content: `REGIMENTO DAS ASSEMBLEIAS E DO PROCESSO ELEITORAL

1. DELEGADOS: 1 delegado por 30 associados, mínimo 1 por Estado, máximo conforme regimento. Eleitos por reunião de associados naturais.

2. ELEIÇÕES: Devem ocorrer com antecedência mínima de 30 dias antes do término do mandato. Convocadas por edital com antecedência mínima de 60 dias.

3. ELEGIBILIDADE: Associados naturais filiados há pelo menos 3 anos, sem rejeição de contas, em chapa completa registrada.

4. ELEITOR: Associado natural em pleno gozo dos direitos sociais e quite com a contribuição mensal.

5. VOTO: Individual, secreto, direto. Pode ser por cédula ou sistema eletrônico.

6. IMPUGNAÇÕES: Prazo de 3 dias da publicação da relação de chapas. Versar sobre causas de inelegibilidade.

7. APURAÇÃO: Maioria simples. Em empate, nova votação. Eleição anulada quando vícios comprometerem legitimidade.

8. RECURSOS: Prazo de 10 dias da divulgação do resultado.

9. POSSE: Após proclamação, até o último dia útil do mandato da diretoria em exercício.`
  },
  {
    id: "adi_4151",
    title: "ADI 4151 — Base Completa",
    category: "adi_4151",
    content: `ADI 4151 – BASE DE CONTEXTO E RESPOSTAS

RESUMO EXECUTIVO: A ADI 4151 constitui o eixo de defesa jurídica dos servidores redistribuídos da extinta Receita Previdenciária para a Receita Federal do Brasil.

DIREITOS RECONHECIDOS E MARCOS TEMPORAIS:
- Analista do Seguro Social: SIM — efeitos a partir de 07/04/2022
- Técnico do Seguro Social: SIM — efeitos a partir de 06/09/2024 | Pagamento em folha desde 01/01/2025

QUEM NÃO É ALCANÇADO:
1. Servidores que optaram voluntariamente pelo retorno ao INSS
2. Servidores que não foram efetivamente redistribuídos à RFB

HISTÓRICO:
- 2008: Ajuizamento da ADI 4151
- 19/04/2021: Congresso derruba Veto 8/2009 (380 votos Câmara / 50 Senado)
- 08/2021: Ajuizamento da ADI 6966
- 04/2022: ADI 6966 — Reforma da Liminar favorável aos Analistas
- 11/2023: Julgamento de mérito ADIs 4151, 4616 e 6966 — reconhece direito dos Analistas
- 08/2024: Embargos da UNASLAF — STF reconhece direito dos Técnicos
- 13/02/2026: Início julgamento Embargos AGU — voto Gilmar Mendes + Zanin + Flávio Dino (3 votos)
- 13/03/2026: Voto Dias Toffoli (4 votos favoráveis)
- 16/03/2026: SUSPENSÃO — pedido de vista Min. Alexandre de Moraes

STATUS ATUAL (março/2026): Julgamento suspenso. Pedido de vista Min. Alexandre de Moraes. Ponto central: extensão definitiva dos efeitos para ativos e inativos e modulação final.

INATIVOS: Tema tratado com cautela. Há portaria enquadrando aposentados e instituidores de pensão (Analistas). Para Técnicos, análise individual necessária.

FUNDAMENTOS: Princípio da Isonomia. Art. 10, II, Lei 11.457/2007. Voto condutor: Min. Gilmar Mendes.`
  },
  {
    id: "portaria_7243",
    title: "Portaria 7.243/2022 — Analistas Ativos",
    category: "portarias",
    content: `PORTARIA 7.243/2022 – ANALISTAS ATIVOS

Enquadra no cargo de Analista-Tributário da RFB, Classe S, Padrão III, os servidores ocupantes do cargo de Analista do Seguro Social, com efeitos a partir de 07/04/2022.

Publicada em 28/06/2022 pelo Ministério da Economia.
Processo: 00745.011988/2021-61.

ANALISTAS ENQUADRADOS (lista completa):
ADEMIR MIGUEL, ADRIANA SATIE OSHIRO, ADRIANA SQUERICH STANIECKI, ADRIANO KISHIMOTO, AILTON DE MELO MESSIAS JUNIOR, ALECSANDRA FRANCO DE MELO, ALEXANDRE CREMER, ALEXANDRE DE LIMA E SILVA, ALOISIO BARBOSA CAMPOS, ANA CATARINA DE LUCENA, ANA KARLA JALES DANTAS, ANDERSON JACO MARAN, ANDERSON JOSE RIBEIRO SALEME, ANDRE GIORDANI SANTOS SILVA, ANDREA GRANGEIRO GOMES LEITAO, ANDREIA CRISTINA MARQUES OTERO, ANGELA BOSSO FARIA BRITO, ANGELA REGINA FERNANDES PAVANI, ANTONIO CARLOS ROCHA MOREIRA, ANTONIO VENANCIO CARDOSO, BENARDETE MARIA TOMAZI, CARINE GISELE HANKE, CARLOS ROBERTO THOME, CAROLINA SCIAMARELLI RELA, CAROLINA VIVAN CARVALHO, CECILIO FELINTO DE OLIVEIRA NETO, CELIA MARIA SANCHES LOURINHO QUEIROZ, CESAR CARLOS RIBEIRO, CHARLES ARAUJO, CLAUDIR CORREA LEMOS, CLEY ANDERSON DE FREITAS BITTENCOURT, CRISTIANE WEIS, DAISY LUCI RIBEIRO DE ARAGAO HEREDA, DANIEL DE OLIVEIRA LEMOS, DANIEL TANIGUCHI, DANIELA BARROSO COSTA BADARO, DANIELA GODOY DE VASCONCELLOS, DANIELE MAIA TOURAO, DANNIELLI DONINI CAMPOLIM, DENISE MARTINEZ GONCALVES, DIEGO MARTINES SENGER, DORIS BECK PAMPLONA SOARES, EDIMAR RIBEIRO AMORIM, EDUARDO SANTOS FELISMINO, EDVAN TEIXEIRA DE SOUSA, ELIZABETH AURELIA DE ANTONI, ELZA HELENA MARTINS FONTANA, EMANUELLE SILVA PEDREIRA, EMILIA MARIA DE SANTANA, ENEDINA PINHEIRO SIMAO AZEVEDO, EVERSON JAIR CASAGRANDE MOREIRA, FABIANA CRISTINA DE MELLO, FABIANA DE TONI MARQUES DE OLIVEIRA, FABIO DOS ANJOS BARBOSA, FERNANDA MION CRUZ, FLAVIA MARIA RUBACK CASCARDO DE ALMEIDA, FLAVIA SILVA BARBOSA, FLAVIA TAZINAFFO RODRIGUES DE FARIA, FLAVIANA DE CARVALHO CHAVES DUTRA, FRANCISCO VALDILEME RIBEIRO MOTA, GEIZA CELESTE DA SILVA ASSUNCAO, GEORGE CAVALCANTI CAMELO, GLACYELLE BECE SIMOES GAHIVA, GRAZIELA PIMENTEL, GRAZIELLE DA HORA BARAUNA, GUILHERME BRUNOW NOGUEIRA, HELMUT FERNANDO ROLKE, ISABELA DE SA BEZ GRAHL, ISABELE CRISTINA BARBERO PERES BALDISERA, IVANI DAS GRACAS DAL PRA LAZAROTTO, JACKELINE NUNES DA SILVA, JEFERSON BARBOSA BARRIONUEVO, JOANA DARC DOS SANTOS NASCIMENTO, JOAO DE SOUSA MOTA NETO, JORGE PEDRO BANDEIRA DORES, JOSE ANTONIO BAPTISTA DE ABREU, JOSE DONIZETE DE PAULA, JOSE TAIRONE RODRIGUES DA SILVA, JOSILENE GIOVANA IDALGO BALBINO BELFORT, JULIANA FIASCHI DOTTO, JULIANA WOHLGEMUTH FLEURY VELOSO DA SILVEIRA, JULIANO BATISTA BOHNERT, KAMILLE MARIA CORDEIRO FERNANDES, KARINA CRESTANI DE SOUZA MEGALE, KARINA MARANHA, KIYOKA YONEYA GENDA, KLEBER MOURA DO NASCIMENTO, LECI MARTINS BARBOSA, LILIAN CRISTINA SALDANHA, LUCIANA APARECIDA DA SILVA, LUCIANA TREVENZOLI VALLE, LUCIANE DE FATIMA SOUZA DA SILVA, LUIZ ANTONIO TELO, LUIZ HENRIQUE VILLAR GUIMARAES, LUIZA HELENA ULIANO, MAGALI APARECIDA FLORENCIO RAZERA, MARCELO DOMINGUES LEMOS, MARCELO GOMES DA SILVA, MARCELO MORGANTE, MARCO ANTONIO FIGUEIREDO, MARCOS SOUZA OLIVEIRA, MARIA FERNANDA VASQUES LESSA, MARIA JOSE SOUZA DE MOURA, MARIA PERPETUO SOCORRO NOVAES SOUTO, MARIA SALETE COSTA, MARLEY FERNANDA ARAUJO RABELLO MEDINA, MARTHA DE CARVALHO BRESSER DORES, MARTHA FRANCA CAMARA, MAURA RIGON MACHADO, MICHELE NAIRA SALOMAO, MILTON NOBUHIRO ITAGAKI, MURILO VIOLA, NAIR SANAE KIYOTA, NANCY YARA GRILLI, NELSON PEREIRA VILASBOAS, ODAMIR FEITOSA DE SA FILHO, OLGA MARIA CARDOSO DE SOUZA, OSCAR FERNANDO DE MATTOS FILHO, OSVALDO YOSHIHARU HIRAMA, PATRICIA CINTIA MACHADO, PRISCILA NUBIA DA SILVA, RAQUEL CRISTINA DARONCO RADIS, RENATA APARECIDA AGUIAR DA SILVA, RENATA PESTILHO SENNA, RITA MARIA CRUZ FREITAS, ROBSON RODRIGUES MACHADO, ROCICLENE DE ALMEIDA BARBOSA, RODRIGO TELLES CORREIA DAS NEVES, RODRIGO VARELLA DOTTO, ROMERO MOREIRA PIMENTEL, RONI RODRIGUES DE SOUZA, ROSANGELA SANTOS PEREIRA SILVA, RUTILEIA DE SOUSA AGUIAR, SABURO MORIYA, SAMANTHA MARA BROCCO SILVA CARDOSO, SAMANTHA SILVEIRA CORREA DE MELO, SANDRA ALVES CRUZ MENDONCA, SANDRA SILVA ACRAS, SANDRO NERY DORTAS MONTARGIL, SERGIO LUIS DA SILVA, SERGIO LUIZ HAGEMANN, SIMONE APARECIDA DE OLIVEIRA BUENO, SIMONE CRISTINA VALENTIM DE PAULA BARRETO, SOLANGE APARECIDA VIANNA CARECHO, TATIANA FLORAO CORREA, TERENCE FERNANDEZ XAVIER, THELMA COLOMBO BOLLA, TIAGO DE CASTRO RUBIATTI, VALNI DE SOUZA, VICENTE ARAUJO DE SOUZA VERAS NETO, WILLIAN ANDRADE SERAFIM, WOLFGANG ADOLFO FIEDLER`
  },
  {
    id: "portaria_9546",
    title: "Portaria 9.546/2022 — Aposentados e Pensionistas",
    category: "portarias",
    content: `PORTARIA 9.546/2022 – ANALISTAS APOSENTADOS E INSTITUIDORES DE PENSÃO

Enquadra servidores aposentados e instituidores de pensão (Analista do Seguro Social) no cargo de Analista-Tributário da RFB, com efeitos a partir de 07/04/2022.

Publicada em 19/08/2022.

ENQUADRADOS:
AUREA JI (aposentado, S-II), CARLOS HENRIQUE DOS SANTOS E SILVA (instituidor pensão, S-II), DANIELA MACHADO GOMES (instituidor pensão, 2-III), EUCLIMAR SOARES DE LIMA (aposentado, S-II), FLAVIO LUIZ SOARES PIRES (aposentado, S-III), HELENA ALVES DA SILVA (aposentado, S-III), IVAN FIEDORUK (instituidor pensão, S-II), JAN JANECZEK (aposentado, S-II), JERONIMO SILVA DE SOUZA (aposentado, S-III), JORGE BEZERRA DOS SANTOS (aposentado, S-III), JOSE OVIDIO CORREIA (aposentado, S-I), LUIZ MIRANDA DA SILVA NETO (aposentado, S-II), MARIA LUCIA PAGLIUSI SILVA (aposentado, 1-III), MARISA HELENA FERREIRA (aposentado, S-II), MAURA BAPTISTA DE AZEVEDO (aposentado, S-II), NAOMI OTSUKI ITANO (aposentado, S-III), PATRICIA LUCAS GULARTE (instituidor pensão, 1-II), PAULO AKIRA TUTIYA (instituidor pensão, S-II), PEDRO AUGUSTO RAMOS (aposentado, S-III), PEDRO DE OLIVEIRA FILHO (aposentado, S-II), ROBERTO MENDES DE LIRIO (aposentado, 1-II), SHEILA MONIQUE SOUTO LEITE NAJAR (aposentado, S-III)`
  },
  {
    id: "acoes_indice",
    title: "Índice de Ações Coletivas",
    category: "acoes_coletivas",
    content: `RELATÓRIO DAS AÇÕES COLETIVAS – JULHO/2023

ATENÇÃO: Status atualizado até julho/2023. Confirmar andamento atual nos sistemas processuais.

ÍNDICE COMPLETO DAS 15 AÇÕES:
1. Adicional de Fronteira | Processo 1022299-41.2018.4.01.3400 (22ª Vara SJDF)
2. IN nº 02/2018 – Jornada/Abono de Ponto | MS 1024043-71.2018.4.01.3400 (2ª Vara SJDF)
3. Danos Materiais GEAP | Processo 1012481-65.2018.4.01.3400 (21ª Vara SJDF)
4. Suspensão dos Efeitos da MP 873/2019 | Processo 1007732-68.2019.4.01.3400 (6ª Vara SJDF)
5. Auxílio Transporte Coletiva | Processo 1004692-44.2020.4.01.3400 (6ª Vara SJDF)
6. Auxílio Transporte Grupo Específico | Processo 1009517-65.2019.4.01.3400 (22ª Vara SJDF)
7. Mandado de Segurança COVID-19 | Processo 1015579-87.2020.4.01.3400 (4ª Vara SJDF) — ARQUIVADO
8. PASEP | Processo 0727740-19.2020.8.07.0001 (24ª Vara TJDFT) — SUSPENSO/IRDR
9. Abono de Permanência | Processo 1019847-53.2021.4.01.3400 (6ª Vara SJDF)
10. Paridade | Processo 1023229-54.2021.4.01.3400 (2ª Vara SJDF)
11. Reposição ao Erário | Processo 1005217-89.2021.4.01.3400 (13ª Vara SJDF)
12. Conversão Licença Prêmio em Pecúnia | Processo 1074276-67.2021.4.01.3400 (8ª Vara SJDF)
13. Inexigibilidade IRPF sobre Auxílio-Creche | Processo 1079393-39.2021.4.01.3400 (5ª Vara SJDF) — TRANSITADO
14. Inexigibilidade Quota Participação Auxílio Creche | Processo 1080942-84.2021.4.01.3400 (3ª Vara SJDF)
15. Inconstitucionalidade Dobra Teto Contribuição | Processo 1084980-42.2021.4.01.3400 (17ª Vara SJDF)`
  },
  {
    id: "acao1_fronteira",
    title: "Ação 1 — Adicional de Fronteira",
    category: "acoes_coletivas",
    content: `AÇÃO 1 | Adicional de Fronteira
Processo: 1022299-41.2018.4.01.3400 (22ª Vara SJDF)

OBJETO: Garantir aos servidores da Carreira do Seguro Social redistribuídos para a RFB a percepção do adicional de fronteira (Lei 12.855/2013) — indenização para servidores em localidades estratégicas vinculadas à prevenção e repressão de delitos transfronteiriços.

PEDIDOS: Tutela de urgência para implementação imediata; condenação da União na obrigação de fazer; pagamento das parcelas vencidas desde o Decreto Regulamentador 9.227/2017 (06/12/2017).

FASE ATUAL (jul/2023): 
- Sentença de improcedência (abril/2020)
- Embargos não acolhidos (25/01/2021)
- Recurso de Apelação (13/07/2021)
- Redistribuído por sorteio (14/05/2023) em razão de criação de unidade judiciária
- Mérito pendente de julgamento no TRF1`
  },
  {
    id: "acao2_jornada",
    title: "Ação 2 — Jornada/Abono de Ponto",
    category: "acoes_coletivas",
    content: `AÇÃO 2 | IN nº 02/2018 – Jornada de Trabalho/Abono de Ponto
Processo: MS Coletivo 1024043-71.2018.4.01.3400 (2ª Vara SJDF)

OBJETO: Mandado de Segurança para suspender o artigo 36 da IN 02/2018 (MPDG) — que exige compensação das horas não trabalhadas por dirigentes sindicais em atividades da entidade.

PEDIDOS: Liminar para suspender art. 36 da IN 02/2018; nulidade do artigo, possibilitando dispensa de ponto para participação em atividades da UNASLAF sem compensação.

FASE ATUAL (jul/2023):
- Liminar indeferida
- Sentença de improcedência (novembro/2021)
- Embargos rejeitados (29/11/2022)
- Recurso de Apelação interposto (02/02/2023)`
  },
  {
    id: "acao3_geap",
    title: "Ação 3 — Danos Materiais GEAP",
    category: "acoes_coletivas",
    content: `AÇÃO 3 | Danos Materiais GEAP
Processo: 1012481-65.2018.4.01.3400 (21ª Vara SJDF) → redistribuído para TJDFT

OBJETO: Questiona legalidade das Resoluções GEAP 99/2015, 168/2016 e 269/2017 que alteraram contribuições mensais dos servidores para o plano de saúde.

PEDIDOS: Suspensão dos reajustes; reconhecimento da ilegalidade; ressarcimento das diferenças com juros e correção.

FASE ATUAL (jul/2023):
- Apelação desprovida (novembro/2021)
- REsp 1987466/DF admitido (07/02/2022)
- Concluso ao Min. Humberto Martins (STJ) aguardando decisão`
  },
  {
    id: "acao4_mp873",
    title: "Ação 4 — MP 873/2019",
    category: "acoes_coletivas",
    content: `AÇÃO 4 | Suspensão dos Efeitos da MP 873/2019
Processo: 1007732-68.2019.4.01.3400 (6ª Vara SJDF)

OBJETO: Suspender efeitos da MP 873/2019 e Decreto 9.735/2019 que excluíram o desconto em folha de contribuições associativas — manter descontos/consignações das mensalidades da UNASLAF.

RESULTADO: Sentença procedente (22/04/2020) — União condenada a restabelecer consignação.
União interpôs Apelação.

FASE ATUAL (jul/2023): Remetido ao TRF em grau de recurso (22/10/2020), aguardando julgamento.`
  },
  {
    id: "acao5_auxilio_transp_coletiva",
    title: "Ação 5 — Auxílio Transporte Coletiva",
    category: "acoes_coletivas",
    content: `AÇÃO 5 | Auxílio Transporte Coletiva
Processo: 1004692-44.2020.4.01.3400 (6ª Vara SJDF)

OBJETO: Suspender atos que excluam/reduzam o auxílio-transporte; declarar inválida a IN/SGDP/ME 207/2009; garantir pagamento independentemente do meio de transporte (próprio ou coletivo).

FASE ATUAL (jul/2023):
- Sentença de improcedência (02/08/2021)
- Embargos rejeitados (02/03/2022)
- Recurso de Apelação da UNASLAF (04/04/2022)
- Redistribuído por sorteio (14/05/2023)`
  },
  {
    id: "acao6_auxilio_transp_grupo",
    title: "Ação 6 — Auxílio Transporte Grupo Específico",
    category: "acoes_coletivas",
    content: `AÇÃO 6 | Auxílio Transporte Grupo Específico
Processo: 1009517-65.2019.4.01.3400 (22ª Vara SJDF)

OBJETO: Suspender exclusão/redução do auxílio-transporte para grupo específico de servidores.

RESULTADO: Sentença procedente (12/03/2020) — reconheceu direito ao auxílio-transporte sem descontos, inclusive para transporte próprio.

FASE ATUAL (jul/2023): União interpôs Apelação. Redistribuído ao TRF1 por dependência. Concluso para decisão (07/02/2022).`
  },
  {
    id: "acao7_covid",
    title: "Ação 7 — COVID-19 (Arquivada)",
    category: "acoes_coletivas",
    content: `AÇÃO 7 | Mandado de Segurança COVID-19
Processo: 1015579-87.2020.4.01.3400 (4ª Vara SJDF)

OBJETO: Suspender atendimentos presenciais nos CAC e Agências da RFB durante pandemia COVID-19.

RESULTADO: ARQUIVADO DEFINITIVAMENTE (19/10/2021).
Liminar deferida inicialmente, mas segurança denegada em outubro/2020. Embargos não acolhidos.`
  },
  {
    id: "acao8_pasep",
    title: "Ação 8 — PASEP",
    category: "acoes_coletivas",
    content: `AÇÃO 8 | PASEP
Processo: 0727740-19.2020.8.07.0001 (24ª Vara TJDFT)

OBJETO: Diferenças a título de PASEP — questiona má gestão pelo Banco do Brasil dos valores depositados, com atualização monetária insuficiente.

PEDIDOS: Condenação do Banco do Brasil a pagar valores devidamente atualizados conforme LC 08/1970.

FASE ATUAL (jul/2023): SUSPENSO por SIRDR 9 do STJ — aguarda trânsito em julgado de IRDR sobre prazo prescricional e legitimidade passiva do BB.

NOTA ATUALIZADA: Conforme CTX do sistema — ação julgada IMPROCEDENTE (março/2026).`
  },
  {
    id: "acao9_abono_permanencia",
    title: "Ação 9 — Abono de Permanência",
    category: "acoes_coletivas",
    content: `AÇÃO 9 | Abono de Permanência
Processo: 1019847-53.2021.4.01.3400 (6ª Vara SJDF)

OBJETO: Reconhecimento da natureza remuneratória do abono de permanência e inclusão na base de cálculo do terço constitucional de férias e gratificação natalina.

RESULTADO (junho/2023): Sentença procedente CONFIRMADA em Apelação.
STJ (Tema 424): abono de permanência tem natureza remuneratória.
Honorários: 10% sobre valor da condenação.
União: apelação não provida. UNASLAF: apelação provida quanto à base de cálculo dos honorários.`
  },
  {
    id: "acao10_paridade",
    title: "Ação 10 — Paridade",
    category: "acoes_coletivas",
    content: `AÇÃO 10 | Paridade
Processo: 1023229-54.2021.4.01.3400 (2ª Vara SJDF)

OBJETO: Revisão de aposentadorias e pensões para garantir paridade com servidores ativos — mesmos índices, vantagens, reenquadramento e gratificações de desempenho.

FASE ATUAL (jul/2023): Em 08/03/2023 — Réplica apresentada pela UNASLAF. Aguardando julgamento.`
  },
  {
    id: "acao11_reposicao_erario",
    title: "Ação 11 — Reposição ao Erário",
    category: "acoes_coletivas",
    content: `AÇÃO 11 | Reposição ao Erário
Processos: 1005217-89.2021.4.01.3400/DF e 5024330-86.2020.4.03.6100/SP

OBJETO: Suspender cobrança de reposição ao erário referente à Reclamação Trabalhista 1382/92, cuja decisão foi rescindida posteriormente.

FASE ATUAL (jul/2023): Aguarda julgamento do Agravo de Instrumento 5014983-25.2022.4.03.0000/SP. Recurso aguarda análise do pedido de efeito suspensivo.`
  },
  {
    id: "acao12_licenca_premio",
    title: "Ação 12 — Conversão Licença Prêmio",
    category: "acoes_coletivas",
    content: `AÇÃO 12 | Conversão da Licença Prêmio Não Gozada em Pecúnia
Processo: 1074276-67.2021.4.01.3400 (8ª Vara SJDF)

OBJETO: Direito de converter licença-prêmio/especial não gozada em pecúnia na aposentadoria; não incidência de IRPF sobre valor indenizado (Súmula 136/STJ).

FASE ATUAL (jul/2023): Juízo indeferiu pedido da entidade e determinou emenda. Prazo fatal 19/07/2023.`
  },
  {
    id: "acao13_irpf_creche",
    title: "Ação 13 — IRPF Auxílio-Creche (Transitada)",
    category: "acoes_coletivas",
    content: `AÇÃO 13 | Inexigibilidade IRPF sobre Auxílio-Creche
Processo: 1079393-39.2021.4.01.3400 (5ª Vara SJDF)

OBJETO: Declarar não-incidência do IRPF sobre auxílio-creche e assistência pré-escolar. Restituição dos valores cobrados nos últimos 5 anos com SELIC.

RESULTADO: VITÓRIA — Sentença procedente (17/03/2022). União não recorreu.
TRÂNSITO EM JULGADO: 16/05/2022.
STATUS: Aguardando início do cumprimento de sentença.`
  },
  {
    id: "acao14_quota_creche",
    title: "Ação 14 — Quota Participação Auxílio Creche",
    category: "acoes_coletivas",
    content: `AÇÃO 14 | Inexigibilidade de Quota de Participação sobre Auxílio Creche
Processo: 1080942-84.2021.4.01.3400 (3ª Vara SJDF)

OBJETO: Declarar inexigibilidade de quota de participação dos associados no custeio do auxílio pré-escolar/creche; pagamento integral sem desconto; restituição dos valores descontados.

FASE ATUAL (jul/2023): Tutela urgência indeferida (24/01/2023). Aguarda citação da União.`
  },
  {
    id: "acao15_dobra_teto",
    title: "Ação 15 — Dobra do Teto Contribuição",
    category: "acoes_coletivas",
    content: `AÇÃO 15 | Inconstitucionalidade — Dobra do Teto da Contribuição Previdenciária
Processo: 1084980-42.2021.4.01.3400 (17ª Vara SJDF)

OBJETO: Declarar inconstitucionalidade da exação que desconsidera a isenção da dobra do teto na contribuição ao RPPS (§21, art. 40 CF, EC 103/2019) sem observância do prazo nonagesimal.

FASE ATUAL (jul/2023): Entidade confirmou interesse no processamento (15/03/2023). Aguarda citação da União.`
  }
];

// Constrói o contexto completo como string para injetar no prompt
export function buildContextString() {
  return UNASLAF_DOCS.map(doc =>
    `===== ${doc.title.toUpperCase()} =====\n${doc.content}`
  ).join('\n\n');
}

// Busca documentos relevantes para uma pergunta
export function findRelevantDocs(query) {
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const keywords = q.split(/\s+/).filter(w => w.length > 3);

  const scored = UNASLAF_DOCS.map(doc => {
    const text = (doc.title + ' ' + doc.category + ' ' + doc.content)
      .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const score = keywords.reduce((acc, kw) => {
      const count = (text.match(new RegExp(kw, 'g')) || []).length;
      return acc + count;
    }, 0);
    return { doc, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(s => s.doc);
}
