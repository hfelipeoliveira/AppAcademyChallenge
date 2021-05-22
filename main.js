const formulario = document.getElementById("formulario");
const arquivo = document.getElementById("arquivo");

function conersorParaArray(str){
    const cabecalho = str.slice(0, str.indexOf("\n")).split(";");
    const linhas = str.slice(str.indexOf('\n') + 1).split('\n');

    const arr = linhas.map(function (linha) {
        const values = linha.split(';');
        const el = cabecalho.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
      });
    
      return arr;
}

 //  Função para exibir os resultados na lista
function addResultados(str){
    var resultados = document.getElementById("resultados").innerHTML;
    document.getElementById("resultados").innerHTML = resultados + "<li>"+ str + "</li>";
}

//  Quem é o professor de Android
function quemEOProfessor(item){
    if (item.Vaga != 'Android' && item.Estado == 'SC'){
        var idadeProfessor = Number(item.Idade.replace(" anos", ""));
        if(idadeProfessor <= 31 && idadeProfessor >= 21 && (idadeProfessor % 2 == 1)){
            var partesDoNome = item.Nome.split(" ");
            if(partesDoNome[0].slice(-1) == "o" && partesDoNome[0].match(/[aeiouy]/gi).length == 3){
                const resultadoProfessor = "O profesor para a turma de Android é o " + item.Nome;
                console.log(resultadoProfessor);
                addResultados(resultadoProfessor);
            }
        }
    }
}

// Capta o CSV
formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = arquivo.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const dados = conersorParaArray(text);
        var curso = [];
        var numeroCandidatos = 0;
        var somaIdadeMediaQA = 0;
        var uf = [];
        dados.forEach(item => {
            if (!(typeof item.Vaga === "undefined")) {

                numeroCandidatos++;
                if (typeof curso[item.Vaga] === "undefined") {
                    curso[item.Vaga] = 0;
                }
                curso[item.Vaga]++;

                if(item.Vaga == "QA"){
                    somaIdadeMediaQA += Number(item.Idade.replace(" anos", ""));
                }
                
                if (typeof uf[item.Estado] === "undefined") {
                    uf[item.Estado] = 0;
                }
                uf[item.Estado]++;

                quemEOProfessor(item);
            }
        });


        //  Porcetaguem em cada curso
        for (var prop in curso) {
            var resultadoProcentagemCurso = prop + ": " + (curso[prop] * 100 / numeroCandidatos).toFixed(2) +"%";
            console.log(resultadoProcentagemCurso);
            addResultados(resultadoProcentagemCurso);
        }

        //  Idade média dos candidatos QA
        (function(){
            const resultadoIdadeMediaQA = "Os candidatos QA tem em média " + (somaIdadeMediaQA/curso['QA']).toFixed() + " anos";
            console.log(resultadoIdadeMediaQA);
            addResultados(resultadoIdadeMediaQA);
        })();

        //  Número de estados distintos presentes na lista
        (function(){
            const resultadoQuantidadeEstado = "Incrições de " + Object.keys(uf).length + " estados distintos";
            console.log(resultadoQuantidadeEstado);
            addResultados(resultadoQuantidadeEstado);
        })();

        // Mostrar o nome do estado e a quantidade de candidatos dos 2 estados com menos ocorrências
        function ortogrfiaInscricao(n){
            if (n > 1){
                return n + " inscrições";
            }else{
                return n + " inscrição";
            }
        }
        (function(){
            var entradas = Object.entries(uf);
            var estadosPorInscricao = entradas.sort((a, b) => a[1] - b[1]);
            const resultadoEstadosMenosOcorrencias = "Os ~dois~ estados com menos ocorrências são " + estadosPorInscricao[0][0] + " (" + ortogrfiaInscricao(estadosPorInscricao[0][1]) +
            ") e " + estadosPorInscricao[1][0] + " (" + ortogrfiaInscricao(estadosPorInscricao[1][1]) + ")";
            console.log(resultadoEstadosMenosOcorrencias);
            addResultados(resultadoEstadosMenosOcorrencias);
        })();


        // Okay, são 23:27 do dia 21, não vai dar tempo...
        // Mas esta ficando muito legal, vou terminar mesmo assim e deixar no meu Github caso queira ver
        // https://github.com/hfelipeoliveira/AppAcademyChallenge

    };
    
    reader.readAsText(input);
});

