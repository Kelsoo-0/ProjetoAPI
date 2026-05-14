// Declarações dos elementos usando DOM(Document Object Model)
const videoElemento = document.getElementById('video');
const botaoScanear = document.getElementById('btn-texto');
const resultado = document.getElementById('saida');
const canvas = document.getElementById('canvas');


// Função assincrona para habilitar a câmera

async function configurarCamera() {
    // Tratamento de Erros
    try {
        // Chama a API do navegador para solicitar acesso
        const midia = await navigator.mediaDevices.getUserMedia({
            // Habilita a câmera traseira
            video:{facingMode: 'environment'},
            // O áudio não será capturado
            audio: false
        });
        // recebe a função midia para ser executada
        videoElemento.srcObject=midia;
        // força a reprodução do vídeo
        videoElemento.play();


    } catch (erro){
        resultado.innerText = "erro ao acessar a câmera", erro;
    }
    
}
// Executando a função
configurarCamera();

// Função para capturar o texto da câmera
botaoScanear.onclick = async ()=>{
    // estou habilitando a camera
    botaoScanear.disabled = true;
    resultado.innerText = 'Fazendo a leitura do texto... aguarde'
    
    // Define o canvas para iniciar a leitura
    const contexto = canvas.getContext('2d');

    // Ajusta o tamanho do canvas para o tamanho real do vídeo
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // Aplica o filtro para melhorar o OCR
    contexto.filter = 'contraste(1.2) grayscale(1)'

    // Desenha o video no canvas
    contexto.drawImage(videoElemento,0,0,canvas.width,canvas.height)

    try {
        const {data:{texto}} = await Tesseract.recognize(
            canvas,
            'por' //Define o idioma
        );
        // remove os espaços em brancos
        const textoFinal = texto.trim();
        // Estrutura condicional ternaria (If = ? | Else = :)
        resultado.innerText = textoFinal.lenght > 0? textoFinal: 'Não foi possível identificar o texto';

    } catch (erro) {
        resultado.innerText = 'Erro no processamento',erro
    }
    finally{
        // Desabilita o botão para fazer uma nova captura
            botaoScanear.disabled = false;
    }
}