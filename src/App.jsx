import React, { useState, useEffect, useRef } from 'react';

// Componente Typewriter para efeito de digitação
const Typewriter = ({ text, speed = 50, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete && !isFinished) {
      setIsFinished(true);
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete, isFinished]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsFinished(false);
  }, [text]);

  return <div className={`typewriter-text ${isFinished ? 'finished' : ''}`}>{displayText}</div>;
};

// Componente para escrita à mão no pergaminho
const HandwrittenTypewriter = ({ text, speed = 80, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const char = text[currentIndex];
      const charSpeed = char === ' ' ? speed * 0.3 : 
                      char === '.' ? speed * 2 : 
                      char === ',' ? speed * 1.5 : 
                      speed + Math.random() * 40;
      
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + char);
        setCurrentIndex(prev => prev + 1);
      }, charSpeed);
      return () => clearTimeout(timer);
    } else if (onComplete && !isFinished) {
      setIsFinished(true);
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete, isFinished]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsFinished(false);
  }, [text]);

  return (
    <div className="handwritten-text">
      {displayText}
      {!isFinished && <span className="ink-pen">✒️</span>}
    </div>
  );
};

// Componente para exibir imagens
const SceneImage = ({ src, alt, className = "" }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className={`scene-image-container ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className={`scene-image ${loaded ? 'loaded' : ''}`}
        onLoad={() => setLoaded(true)}
        onError={() => console.log(`Imagem não encontrada: ${src}`)}
      />
    </div>
  );
};

// Componente para título de capítulo
const ChapterTitle = ({ title, subtitle }) => {
  return (
    <div className="chapter-title">
      <h1 className="chapter-main">{title}</h1>
      {subtitle && <h2 className="chapter-sub">{subtitle}</h2>}
    </div>
  );
};

// Componente para estrelas animadas
const StarField = ({ showEasterEgg = false, onStarClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    size: Math.random() * 3 + 1,
    parallaxIntensity: Math.random() * 0.5 + 0.2
  }));

  return (
    <div className="star-field">
      {stars.map(star => (
        <div
          key={star.id}
          className={`star ${showEasterEgg && star.id === 25 ? 'easter-egg-star' : ''}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            transform: `translate(${mousePosition.x * star.parallaxIntensity * 20}px, ${mousePosition.y * star.parallaxIntensity * 20}px)`
          }}
          onClick={showEasterEgg && star.id === 25 ? onStarClick : undefined}
        />
      ))}
    </div>
  );
};

// Componente de botão corrigido
const GameButton = ({ children, onClick, variant = 'primary', disabled = false }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`game-button ${variant} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

// Componente principal
const VisualNovel = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showChapterTitle, setShowChapterTitle] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gameState, setGameState] = useState({
    commentResponse: null,
    relationshipLevel: 0,
    currentPath: 'main',
    choicesMade: []
  });
  const [currentText, setCurrentText] = useState('');
  const [hasChosenOption, setHasChosenOption] = useState(false);

  // Efeito parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sons
  const playVitaresco = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Som não disponível');
    }
  };

  const playWeddingBells = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const frequencies = [523, 659, 784, 523, 659, 784, 1047];
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.setValueAtTime(freq, audioContext.currentTime);
          gain.gain.setValueAtTime(0.2, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
          osc.start();
          osc.stop(audioContext.currentTime + 0.8);
        }, index * 300);
      });
    } catch (error) {
      console.log('Som não disponível');
    }
  };

  const chapters = [
    // CAPÍTULO 1 - O COMENTÁRIO
    {
      id: 0,
      chapter: "Capítulo 1",
      chapterTitle: "O Comentário",
      background: 'youtube-comment',
      text: "3 de março de 2023. Gabriel estava assistindo um vídeo sobre Cálculo quando decidiu responder um comentário de um senhor aleatório. Ele não sabia que esse simples ato mudaria sua vida para sempre...",
      showChapter: true,
      type: 'narrative'
    },
    {
      id: 1,
      background: 'youtube-comment',
      text: "💬 'Q história em bixo 🤣🤣👏👏' - comentário de Gabriel",
      type: 'narrative'
    },
    {
      id: 2,
      background: 'youtube-comment',
      text: "Alguns minutos depois... uma notificação aparece. Alguém respondeu seu comentário! Era uma garota chamada clarisse...",
      type: 'choice',
      choices: [
        { 
          text: "💬 'estranhamente, o seu nome e sua foto de perfil se complementam e isso me conforta.'", 
          nextText: "Clarisse respondeu intrigada. Havia algo caloroso naquela resposta que fez o coração de Gabriel acelerar.",
          action: 'interested_response'
        },
        { 
          text: "🙃 'para de usar emoji, é estranho.'", 
          nextText: "A resposta foi um pouco seca. Gabriel ficou sem saber se havia algo errado ou se era só o jeito dela...",
          action: 'dry_response'
        },
        { 
          text: "💔 [Ela não responde]", 
          nextText: "O silêncio ecoou. Talvez ela não tivesse visto, ou talvez o comentário não tenha chamado atenção. Gabriel nunca foi feliz.",
          action: 'ignored'
        }
      ]
    },

    // CAPÍTULO 2A - AMIZADE (se ela respondeu com interesse)
    {
      id: 3,
      chapter: "Capítulo 2",
      chapterTitle: "A Amizade Floresce",
      background: 'chat-warmth',
      text: "Nos dias seguintes, Gabriel e Clarisse continuaram conversando. O que começou com um comentário em um vídeo, se transformou em longas conversas sobre a vida, onde um se preocupava cada vez mais com o outro. Spoiler alert: Uma vez Clarisse disse que Gabriel foi como alguém que a pegou da rua na chuva e a colocou em uma casa com comida e cobertor...",
      showChapter: true,
      conditional: true,
      requires: 'interested_response',
      type: 'narrative'
    },
    {
      id: 4,
      background: 'chat-warmth',
      text: "16 de janeiro de 2024 - 2:30 da manhã. Eles ainda estavam conversando...",
      type: 'choice',
      choices: [
        { 
          text: "📱 Continuar só por mensagens", 
          nextText: "As mensagens fluíam naturalmente. Cada notificação trazia um sorriso ao rosto de Gabriel.",
          action: 'text_only'
        },
        { 
          text: "🎧 'PERA EU VOU TELEFONAR, VC TEM QUE ESCUTAR E FICAR CALADO TA'", 
          nextText: "27 de abril - A primeira chamada. Quando Gabriel ouviu a voz de Clarisse, soube que estava perdido. Era a voz mais doce que já havia escutado. (e a mais divertida e fofa também)",
          action: 'voice_calls'
        }
      ],
      conditional: true,
      requires: 'interested_response'
    },

    // CAPÍTULO 2B - CAMINHO LENTO (se ela respondeu seco)
    {
      id: 5,
      chapter: "Capítulo 2",
      chapterTitle: "Construindo Pontes",
      background: 'slow-build',
      text: "Apesar da resposta inicial um pouco fria, Gabriel se interessou pelo canal daquela garota. Ao ver sua comunidade, ele percebeu que havia muito mais por trás daquela tela.",
      showChapter: true,
      conditional: true,
      requires: 'dry_response',
      type: 'narrative'
    },
    {
      id: 6,
      background: 'slow-build',
      text: "Com muita curiosidade, Gabriel continuou tentando conhecê-la melhor. Pequenos gestos, comentários atenciosos, sempre respeitando o espaço dela...",
      type: 'choice',
      choices: [
        { 
          text: "❤️ 'Ela começou a se abrir comigo'", 
          nextText: "Aos poucos, as barreiras foram caindo. Clarisse começou a confiar em Gabriel, e suas conversas ficaram mais calorosas.",
          action: 'breakthrough'
        },
        { 
          text: "😔 'Ainda mantém distância'", 
          nextText: "Apesar dos esforços de Gabriel, Clarisse mantinha uma certa frieza. Talvez fosse melhor aceitar que seriam apenas conhecidos.",
          action: 'distant_friends'
        }
      ],
      conditional: true,
      requires: 'dry_response'
    },

    // CAPÍTULO 2C - FINAL TRISTE (se ela ignorou)
    {
      id: 7,
      chapter: "Epílogo",
      chapterTitle: "O Amor Não Floresceu",
      background: 'sad-ending',
      text: "Bem, resposta errada. Gabriel e Clarisse são almas gêmeas predestinadas, e não há espaço para finais tristes nesta história. Jogue novamente e escolha melhor da próxima vez!",
      showChapter: true,
      conditional: true,
      requires: 'ignored',
      isEnding: true,
      type: 'narrative'
    },

    // CAPÍTULO 3 - O CRESCIMENTO DO AMOR
    {
      id: 8,
      chapter: "Capítulo 3",
      chapterTitle: "Raízes do Amor",
      background: 'love-growth',
      text: "25 de julho de 2024 - O dia em que tudo mudou. Gabriel e Clarisse não apenas disseram 'eu te amo', eles haviam descoberto um amor profundo e verdadeiro, algo que estava destinado a acontecer, e que finalmente floresceu. Era o início de uma jornada ainda mais profunda...",
      showChapter: true,
      conditional: true,
      requires: ['interested_response', 'voice_calls'],
      type: 'narrative'
    },
    {
      id: 9,
      background: 'love-journey',
      text: "Os meses que se seguiram foram como uma árvore crescendo... As raízes do seu amor foram se aprofundando e se fixando cada vez mais, como uma árvore imortal. Eles cresceram juntos, vencendo e amadurecendo com todas as dificuldades da vida.",
      conditional: true,
      requires: ['interested_response', 'voice_calls'],
      type: 'narrative'
    },
    {
      id: 10,
      background: 'love-journey',
      text: "Passaram por dias tristes e difíceis, onde se apoiaram mutuamente com força e carinho. Viveram dias felizes e de muito amor, onde riram até a barriga doer, sonharam juntos, e descobriram que eram verdadeiramente almas gêmeas. Cada lágrima e cada sorriso os tornava mais unidos.",
      conditional: true,
      requires: ['interested_response', 'voice_calls'],
      type: 'narrative'
    },

    // CAPÍTULO 4 - PEDIDO DE CASAMENTO
    {
      id: 11,
      chapter: "Capítulo 4",
      chapterTitle: "A Grande Pergunta",
      background: 'proposal-moment',
      text: "Certo tempo depois... Gabriel sabia que chegara a hora. Depois de tudo que viveram juntos, tinha certeza absoluta: queria Clarisse como sua esposa para sempre. Seu coração batia forte enquanto segurava o anel que levaria ao que sempre desejavam...",
      showChapter: true,
      conditional: true,
      requires: ['interested_response', 'voice_calls'],
      type: 'narrative'
    },
    {
      id: 12,
      background: 'proposal-moment',
      text: "💍 Gabriel se ajoelha com um anel brilhante na mão: 'Clarisse, meu amor... depois de tudo que vivemos juntos, você quer se casar comigo? Quer ser minha esposa para sempre? ❤️'",
      image: "/images/proposal.jpg",
      imageAlt: "Pedido de casamento romântico com anel",
      imageClass: "proposal-image",
      type: 'choice',
      choices: [
        { 
          text: "💍 'SIM! Quero me casar com você!'", 
          nextText: "'SIM! Mil vezes sim! Quero ser sua esposa! Você é o amor da minha vida, Gabriel! 💕💕💕'",
          action: 'accept_marriage'
        },
        { 
          text: "😅 'É muito cedo... vamos esperar mais um pouco'", 
          nextText: "'Gabriel... eu te amo muito, mas acho que é muito cedo para casamento. Podemos esperar mais um pouco? Quero ter certeza... 💜'",
          action: 'hesitant_marriage'
        },
        { 
          text: "❌ 'Não estou pronta para casar'", 
          nextText: "'Gabriel... você é incrível e te amo, mas não me sinto pronta para o casamento ainda. Podemos continuar namorando? 💙'",
          action: 'not_ready_marriage'
        }
      ],
      conditional: true,
      requires: ['interested_response', 'voice_calls']
    },

    // NOIVADO (se ela aceitou casar)
    {
      id: 13,
      background: 'engagement',
      text: "💕 Clarisse estava radiante! Gabriel colocou o anel de noivado em seu dedo e eles se abraçaram emocionados. Era oficial - estavam noivos! O sonho de uma vida juntos estava se tornando realidade.",
      image: "/images/engagement.jpg",
      imageAlt: "Casal feliz após noivado",
      conditional: true,
      requires: 'accept_marriage',
      type: 'narrative'
    },

    // CAPÍTULO 5 - CASAMENTO (Final Feliz Completo)
    {
      id: 14,
      chapter: "Capítulo 5",
      chapterTitle: "Para Sempre Juntos",
      background: 'wedding-preparation',
      text: "6 meses depois... O grande dia chegou! Era o dia mais esperado de suas vidas. Família e amigos reunidos, flores por toda parte, música suave, e dois corações prestes a se unirem para sempre...",
      image: "/images/wedding.jpg",
      imageAlt: "Preparação para casamento",
      showChapter: true,
      conditional: true,
      requires: 'accept_marriage',
      type: 'narrative'
    },
    {
      id: 15,
      background: 'wedding-ceremony',
      text: "'Aceita Clarisse como sua esposa, para amá-la e respeitá-la, na alegria e na tristeza, na saúde e na doença?' 'SIM!' 'Aceita Gabriel como seu marido?' 'SIM!' 'Podem se beijar!' 💒💕",
      image: "/images/wedding.jpg",
      imageAlt: "Cerimônia de casamento",
      imageClass: "wedding-ceremony-image",
      conditional: true,
      requires: 'accept_marriage',
      type: 'narrative'
    },
    {
      id: 16,
      background: 'wedding-ceremony',
      text: "🎉 A festa foi mágica! Votos emocionantes que fizeram todos chorarem, alianças trocadas com mãos trêmulas de emoção, o beijo mais apaixonado de suas vidas, e uma celebração inesquecível com todos que amavam.",
      image: "/images/wedding.jpg",
      imageAlt: "Festa de casamento",
      conditional: true,
      requires: 'accept_marriage',
      type: 'narrative'
    },
    {
      id: 17,
      background: 'honeymoon-night',
      text: "🌙 Naquela noite... finalmente sozinhos como marido e mulher. Sob um céu estrelado, em perfeita harmonia, Gabriel e Clarisse selaram seu amor da forma mais íntima e bela. Dormindo abraçados, sonharam com uma vida inteira de amor, cumplicidade e aventuras juntos. ✨💕",
      image: "/images/honeymoon.jpg",
      imageAlt: "Lua de mel romântica",
      conditional: true,
      requires: 'accept_marriage',
      type: 'narrative'
    },

    // FINAL ÉPICO - CASAMENTO COM TEXTO
    {
      id: 18,
      background: 'wedding-final',
      text: `De um simples comentário sobre Cálculo até o altar... que jornada incrível vivemos!
Cada escolha, cada momento, cada 'sim' nos trouxe até aqui. Das mensagens tímidas às madrugadas conversando, do primeiro 'eu te amo' até este altar sagrado.
Como uma árvore que cresce forte, nossas raízes se aprofundaram através de risos e lágrimas, sonhos e desafios. Crescemos juntos, nos apoiamos, e descobrimos que éramos verdadeiramente almas gêmeas.
Agora, como marido e mulher, prometo novamente te amar em cada novo amanhecer, em cada desafio que a vida trouxer, em cada sonho que realizarmos juntos.
Te amo para sempre 💕`,
      image: "/images/wedding.jpg",
      imageAlt: "Final épico do casamento",
      conditional: true,
      requires: 'accept_marriage',
      type: 'narrative'
    },

    // FINAL DEFINITIVO - FELIZES PARA SEMPRE
    {
      id: 19,
      background: 'eternal-love',
      text: `E assim, Gabriel e Clarisse viveram felizes para sempre...

Construíram uma família linda, enfrentaram juntos todos os desafios da vida, riram juntos todos os dias, e envelheceram de mãos dadas.

Sua história de amor, que começou com um simples comentário sobre matemática, se tornou a mais bela equação da vida: amor verdadeiro, eterno e infinito.

💕 FIM 💕`,
      image: "/images/family.jpg",
      imageAlt: "Família feliz para sempre",
      conditional: true,
      requires: 'accept_marriage',
      isEnding: true,
      type: 'narrative'
    },
    {
      id: 16,
      background: 'wedding-ceremony',
      text: "🎉 A festa foi mágica! Votos emocionantes que fizeram todos chorarem, alianças trocadas com mãos trêmulas de emoção, o beijo mais apaixonado de suas vidas, e uma celebração inesquecível com todos que amavam.",
      conditional: true,
      requires: 'accept_marriage',
      type: 'narrative'
    },
    {
      id: 17,
      background: 'honeymoon-night',
      text: "🌙 Naquela noite... finalmente sozinhos como marido e mulher. Sob um céu estrelado, em perfeita harmonia, Gabriel e Clarisse selaram seu amor da forma mais íntima e bela. Dormindo abraçados, sonharam com uma vida inteira de amor, cumplicidade e aventuras juntos. ✨💕",
      conditional: true,
      requires: 'accept_marriage',
      type: 'narrative'
    },

    // FINAL ÉPICO - CASAMENTO COM TEXTO
    {
      id: 18,
      background: 'wedding-final',
      text: `De um simples comentário sobre Cálculo até o altar... que jornada incrível vivemos!
Cada escolha, cada momento, cada 'sim' nos trouxe até aqui. Das mensagens tímidas às madrugadas conversando, do primeiro 'eu te amo' até este altar sagrado.
Como uma árvore que cresce forte, nossas raízes se aprofundaram através de risos e lágrimas, sonhos e desafios. Crescemos juntos, nos apoiamos, e descobrimos que éramos verdadeiramente almas gêmeas.
Agora, como marido e mulher, prometo novamente te amar em cada novo amanhecer, em cada desafio que a vida trouxer, em cada sonho que realizarmos juntos.
Te amo para sempre 💕`,
      conditional: true,
      requires: 'accept_marriage',
      type: 'narrative'
    },

    // FINAL DEFINITIVO - FELIZES PARA SEMPRE
    {
      id: 19,
      background: 'eternal-love',
      text: `E assim, Gabriel e Clarisse viveram felizes para sempre...

Construíram uma família linda, enfrentaram juntos todos os desafios da vida, riram juntos todos os dias, e envelheceram de mãos dadas.

Sua história de amor, que começou com um simples comentário sobre matemática, se tornou a mais bela equação da vida: amor verdadeiro, eterno e infinito.

💕 FIM 💕`,
      conditional: true,
      requires: 'accept_marriage',
      isEnding: true,
      type: 'narrative'
    },

    // FINAIS ALTERNATIVOS
    {
      id: 20,
      chapter: "Capítulo 5",
      chapterTitle: "Esperando o Momento Certo",
      background: 'open-ending',
      text: "Gabriel e Clarisse continuaram namorando, construindo sua base ainda mais sólida. Sabiam que o casamento viria no momento perfeito, quando ambos estivessem completamente prontos para dar esse passo...",
      showChapter: true,
      conditional: true,
      requires: 'hesitant_marriage',
      isEnding: true,
      type: 'narrative'
    },

    {
      id: 21,
      chapter: "Capítulo 5", 
      chapterTitle: "Amor Sem Pressa",
      background: 'dating-ending',
      text: "O amor de Gabriel e Clarisse continuou florescendo no ritmo deles. Não havia pressa - tinham toda uma vida pela frente para construir seus sonhos juntos, passo a passo...",
      showChapter: true,
      conditional: true,
      requires: 'not_ready_marriage',
      isEnding: true,
      type: 'narrative'
    },

    // FINAL AMIZADE (se ela ficou distante)
    {
      id: 22,
      chapter: "Epílogo",
      chapterTitle: "Uma Bela Amizade",
      background: 'friendship-ending',
      text: "Resposta errada. Gabriel e Clarisse são almas gêmeas predestinadas, eles não poderiam, nem aguentariam ficar apenas como amigos. Jogue novamente e escolha melhor da próxima vez!",
      showChapter: true,
      conditional: true,
      requires: 'distant_friends',
      isEnding: true,
      type: 'narrative'
    },

    // FINAL ALTERNATIVO BREAKTHROUGH
    {
      id: 23,
      chapter: "Capítulo 3",
      chapterTitle: "Amor Conquistado",
      background: 'love-growth',
      text: "Depois de tanto esforço e paciência, Gabriel conquistou o coração de Clarisse. O que começou frio se transformou em um amor caloroso e verdadeiro. Às vezes, os melhores amores são aqueles que precisam ser conquistados aos poucos...",
      showChapter: true,
      conditional: true,
      requires: 'breakthrough',
      type: 'narrative'
    },
    {
      id: 24,
      background: 'love-journey',
      text: "Gabriel e Clarisse descobriram que o amor verdadeiro não surge sempre à primeira vista. Às vezes, ele nasce da paciência, do cuidado e da persistência respeitosa. Seu amor, construído tijolo por tijolo, se tornou ainda mais sólido.",
      conditional: true,
      requires: 'breakthrough',
      isEnding: true,
      type: 'narrative'
    },

    // FINAL TEXT ONLY
    {
      id: 25,
      chapter: "Capítulo 3",
      chapterTitle: "Amor Digital",
      background: 'chat-warmth',
      text: "Gabriel e Clarisse continuaram sua história através de mensagens. Cada palavra digitada carregava amor, cada emoji expressava carinho. Provaram que o amor verdadeiro pode florescer mesmo através de uma tela, quando os corações estão conectados...",
      showChapter: true,
      conditional: true,
      requires: 'text_only',
      isEnding: true,
      type: 'narrative'
    }
  ];

  // Verificar se os requisitos são atendidos
  const meetsRequirements = (requires) => {
    if (!requires) return true;
    
    if (Array.isArray(requires)) {
      return requires.every(req => gameState.choicesMade.includes(req));
    }
    
    return gameState.choicesMade.includes(requires);
  };

  // Função para lidar com escolhas
  const handleChoice = (choice) => {
    console.log('Choice selected:', choice.action);
    
    // Atualizar estado do jogo
    const newChoicesMade = [...gameState.choicesMade, choice.action];
    
    setGameState(prev => ({
      ...prev,
      choicesMade: newChoicesMade,
      commentResponse: choice.action.includes('response') ? choice.action : prev.commentResponse,
      currentPath: choice.action === 'accept_marriage' ? 'married' : 
                   choice.action === 'hesitant_marriage' ? 'waiting' :
                   choice.action === 'not_ready_marriage' ? 'dating' :
                   choice.action === 'breakthrough' ? 'romantic' :
                   choice.action === 'distant_friends' ? 'friendship' :
                   choice.action === 'ignored' ? 'sad' : prev.currentPath
    }));

    setCurrentText(choice.nextText);
    setShowChoices(false);
    setIsTyping(true);
    setHasChosenOption(true);
  };

  const handleContinue = () => {
    let nextSceneIndex = currentScene + 1;
    
    // Pular cenas condicionais que não se aplicam
    while (nextSceneIndex < chapters.length) {
      const nextChapter = chapters[nextSceneIndex];
      
      // Se a cena é condicional e os requisitos não são atendidos, pular
      if (nextChapter.conditional && !meetsRequirements(nextChapter.requires)) {
        nextSceneIndex++;
        continue;
      }
      break;
    }

    // Se chegou ao fim
    if (nextSceneIndex >= chapters.length) {
      handleGameEnd();
      return;
    }

    const nextChapter = chapters[nextSceneIndex];
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScene(nextSceneIndex);
      
      setCurrentText(nextChapter.text);
      setIsTyping(true);
      setShowChoices(false);
      setHasChosenOption(false);
      setShowChapterTitle(nextChapter.showChapter || false);
      setIsTransitioning(false);
      
      if (nextChapter.onEnter) {
        nextChapter.onEnter();
      }
    }, 500);
  };

  const handleTypingComplete = () => {
    setIsTyping(false);
    const currentChapter = chapters[currentScene];
    
    // Se é uma cena de escolha e ainda não foi escolhida uma opção
    if (currentChapter.type === 'choice' && !hasChosenOption) {
      setShowChoices(true);
    }
  };

  const handleChapterContinue = () => {
    setShowChapterTitle(false);
    setCurrentText(chapters[currentScene].text);
    setIsTyping(true);
  };

  const handleGameEnd = () => {
    alert('Fim da história!\n\nRefresh da página para jogar novamente!');
    window.location.reload();
  };

  const currentChapter = chapters[currentScene];

  // Inicializar o primeiro texto
  useEffect(() => {
    if (currentScene === 0 && !currentText && !showChapterTitle) {
      setCurrentText(chapters[0].text);
    }
  }, [currentScene, currentText, showChapterTitle]);

  return (
    <div className={`visual-novel ${isTransitioning ? 'transitioning' : ''}`}>
      {/* Título do Capítulo */}
      {showChapterTitle && currentChapter.showChapter && (
        <div className="chapter-overlay">
          <ChapterTitle 
            title={currentChapter.chapter} 
            subtitle={currentChapter.chapterTitle} 
          />
          <GameButton onClick={handleChapterContinue} variant="chapter">
            Começar Capítulo
          </GameButton>
        </div>
      )}

      {/* Fundo dinâmico */}
      <div 
        className={`scene-background ${currentChapter.background}`}
        style={{
          transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`
        }}
      >
        {(currentChapter.background === 'youtube-comment' || currentChapter.background === 'chat-warmth') && (
          <StarField showEasterEgg={currentChapter.hasEasterEgg} onStarClick={playVitaresco} />
        )}
        
        {/* Corações flutuantes para cenas românticas */}
        {(currentChapter.background.includes('proposal') || currentChapter.background.includes('wedding')) && (
          <div className="floating-hearts">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className="heart" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 1 + 0.5}rem`
              }}>💕</div>
            ))}
          </div>
        )}
      </div>

      {/* Imagens especiais para cenas importantes */}
      {!showChapterTitle && currentChapter.image && (
        <SceneImage 
          src={currentChapter.image} 
          alt={currentChapter.imageAlt || "Cena da história"} 
          className={currentChapter.imageClass || ""}
        />
      )}

      {/* Interface do jogo */}
      {!showChapterTitle && (
        <div className="game-interface">
          <div className="text-container">
            <div className="text-box">
              <Typewriter
                text={currentText}
                speed={50}
                onComplete={handleTypingComplete}
              />
            </div>
          </div>

          {/* Botões de escolha */}
          {showChoices && currentChapter.type === 'choice' && currentChapter.choices && (
            <div className="choices-container">
              {currentChapter.choices.map((choice, index) => (
                <GameButton
                  key={index}
                  onClick={() => handleChoice(choice)}
                  variant="choice"
                >
                  {choice.text}
                </GameButton>
              ))}
            </div>
          )}

          {/* Botão continuar */}
          {!isTyping && !showChoices && (
            <div className="continue-container">
              {currentChapter.isEnding ? (
                <GameButton 
                  onClick={handleGameEnd} 
                  variant="final"
                >
                  🎮 Jogar Novamente ✨
                </GameButton>
              ) : (
                <GameButton onClick={handleContinue}>
                  Continuar
                </GameButton>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .visual-novel {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: 'Georgia', serif;
          transition: opacity 0.5s ease-in-out;
        }

        .visual-novel.transitioning {
          opacity: 0.7;
        }

        .visual-novel.transitioning::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          opacity: 0;
          animation: flash 0.5s forwards;
          z-index: 1000;
        }

        @keyframes flash {
          0% { opacity: 0; }
          30% { opacity: 0.8; }
          100% { opacity: 0; }
        }

        .chapter-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: chapterAppear 1s ease-out;
        }

        @keyframes chapterAppear {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .chapter-title {
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }

        .chapter-main {
          font-size: 3.5rem;
          font-weight: bold;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          animation: titleGlow 2s ease-in-out infinite alternate;
        }

        .chapter-sub {
          font-size: 2rem;
          font-weight: normal;
          margin: 10px 0 0 0;
          font-style: italic;
          opacity: 0.9;
        }

        @keyframes titleGlow {
          from { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
          to { text-shadow: 2px 2px 20px rgba(255,255,255,0.8); }
        }

        .scene-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: all 1s ease-in-out;
          will-change: transform;
        }

        .scene-background.youtube-comment {
          background: linear-gradient(45deg, #4a90e2 0%, #7bb3f0 100%);
          position: relative;
        }

        .scene-background.youtube-comment::after {
          content: '💬📺';
          position: absolute;
          top: 20%;
          left: 20%;
          font-size: 3rem;
          animation: commentFloat 3s ease-in-out infinite;
        }

        .scene-background.chat-warmth {
          background: linear-gradient(45deg, #ff6b6b 0%, #ffa500 50%, #ff69b4 100%);
          animation: warmPulse 4s ease-in-out infinite alternate;
        }

        .scene-background.slow-build {
          background: linear-gradient(45deg, #a8edea 0%, #fed6e3 100%);
          animation: slowPulse 6s ease-in-out infinite alternate;
        }

        .scene-background.sad-ending {
          background: linear-gradient(45deg, #232526 0%, #414345 100%);
          position: relative;
        }

        .scene-background.sad-ending::after {
          content: '💔';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 5rem;
          animation: sadPulse 2s ease-in-out infinite;
        }

        .scene-background.love-growth {
          background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
          animation: loveGrowth 4s ease-in-out infinite alternate;
        }

        .scene-background.love-journey {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
        }

        .scene-background.love-journey::after {
          content: '🌳💕';
          position: absolute;
          top: 10%;
          left: 50%;
          font-size: 2.5rem;
          animation: treeGrowth 4s ease-in-out infinite;
        }

        .scene-background.wedding-final {
          background: linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%);
          position: relative;
        }

        .scene-background.wedding-final::after {
          content: '💒👰🤵💕✨';
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 2rem;
          animation: weddingCelebration 3s ease-in-out infinite;
        }

        .scene-background.eternal-love {
          background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #ffeaa7 100%);
          position: relative;
        }

        .scene-background.eternal-love::after {
          content: '👫💕∞';
          position: absolute;
          top: 10%;
          left: 50%;
          font-size: 3rem;
          animation: eternalGlow 4s ease-in-out infinite;
        }

        @keyframes eternalGlow {
          0%, 100% { opacity: 0.8; transform: scale(1) rotate(0deg); text-shadow: 0 0 20px rgba(255, 192, 203, 0.8); }
          50% { opacity: 1; transform: scale(1.1) rotate(5deg); text-shadow: 0 0 30px rgba(255, 192, 203, 1); }
        }

        .scene-background.dating-ending {
          background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%);
        }

        @keyframes loveGrowth {
          0% { filter: brightness(1) hue-rotate(0deg); }
          100% { filter: brightness(1.1) hue-rotate(10deg); }
        }

        .scene-background.proposal-moment {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
        }

        .scene-background.proposal-moment::before {
          content: '💍✨';
          position: absolute;
          top: 30%;
          left: 50%;
          font-size: 2.5rem;
          animation: ringSparkle 2s ease-in-out infinite;
        }

        .scene-background.wedding-preparation {
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        }

        .scene-background.wedding-ceremony {
          background: linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%);
          position: relative;
        }

        .scene-background.wedding-ceremony::after {
          content: '💒👰🤵💕';
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 2rem;
          animation: weddingCelebration 3s ease-in-out infinite;
        }

        .scene-background.honeymoon-night {
          background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
          position: relative;
        }

        .scene-background.honeymoon-night::after {
          content: '🌙✨💕';
          position: absolute;
          top: 10%;
          left: 50%;
          font-size: 2.5rem;
          animation: nightGlow 2s ease-in-out infinite alternate;
        }

        .scene-background.open-ending {
          background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
        }

        .scene-background.friendship-ending {
          background: linear-gradient(45deg, #74b9ff 0%, #0984e3 100%);
          position: relative;
        }

        .scene-background.friendship-ending::after {
          content: '👫💙';
          position: absolute;
          top: 30%;
          left: 30%;
          font-size: 3rem;
          animation: friendshipGlow 3s ease-in-out infinite;
        }

        .scene-background.engagement {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
        }

        .scene-background.engagement::after {
          content: '💍👰🤵💕';
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 2.5rem;
          animation: engagementSparkle 3s ease-in-out infinite;
        }

        @keyframes commentFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes warmPulse {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.2); }
        }

        @keyframes slowPulse {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(30deg); }
        }

        @keyframes sadPulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes ringSparkle {
          0%, 100% { transform: scale(1) rotate(0deg); text-shadow: 0 0 10px gold; }
          50% { transform: scale(1.2) rotate(180deg); text-shadow: 0 0 20px gold; }
        }

        @keyframes weddingCelebration {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
        }

        @keyframes engagementSparkle {
          0%, 100% { transform: translateX(-50%) scale(1) rotate(0deg); text-shadow: 0 0 15px gold; }
          50% { transform: translateX(-50%) scale(1.15) rotate(10deg); text-shadow: 0 0 25px gold; }
        }

        @keyframes nightGlow {
          from { text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); }
          to { text-shadow: 0 0 25px rgba(255, 192, 203, 1); }
        }

        @keyframes friendshipGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes treeGrowth {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          50% { transform: scale(1.1) rotate(2deg); }
        }

        .star-field {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite alternate;
          transition: transform 0.1s ease-out;
        }

        .easter-egg-star {
          background: #ffd700;
          cursor: pointer;
          animation: easterEggTwinkle 1s ease-in-out infinite alternate;
          box-shadow: 0 0 15px #ffd700;
        }

        .easter-egg-star:hover {
          transform: scale(2);
        }

        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        @keyframes easterEggTwinkle {
          0% { opacity: 0.6; box-shadow: 0 0 10px #ffd700; }
          100% { opacity: 1; box-shadow: 0 0 25px #ffd700; }
        }

        .floating-hearts {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .heart {
          position: absolute;
          animation: heartFloat 6s ease-in-out infinite;
          opacity: 0.7;
        }

        @keyframes heartFloat {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }

        .scene-image-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 1000px;
          height: 1000px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          z-index: 5;
          border: 3px solid rgba(255, 255, 255, 0.8);
          animation: imageAppear 1s ease-out;
        }

        .proposal-image {
          width: 1000px !important;
          height: 1000px !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          border: 4px solid gold !important;
          box-shadow: 0 15px 40px rgba(255, 215, 0, 0.5) !important;
          animation: proposalGlow 2s ease-in-out infinite alternate, imageAppear 1s ease-out !important;
        }

        .wedding-ceremony-image {
          width: 1000px !important;
          height: 1000px !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          border: 3px solid rgba(255, 255, 255, 0.9) !important;
          box-shadow: 0 12px 35px rgba(255, 255, 255, 0.4) !important;
        }

        @keyframes imageAppear {
          from { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8) rotate(-5deg); 
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) rotate(0deg); 
          }
        }

        @keyframes proposalGlow {
          from { 
            box-shadow: 0 15px 40px rgba(255, 215, 0, 0.5);
            transform: translate(-50%, -50%) scale(1);
          }
          to { 
            box-shadow: 0 20px 50px rgba(255, 215, 0, 0.8);
            transform: translate(-50%, -50%) scale(1.02);
          }
        }

        .main-scene-image {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 1000px;
          height: 1000px;
        }

        .scene-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }

        .scene-image.loaded {
          opacity: 1;
        }

        .game-interface {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 10;
        }

        .text-container {
          margin: 0 5% 20px 5%;
        }

        .text-box {
          background: rgba(0, 0, 0, 0.8);
          border-radius: 15px;
          padding: 30px;
          color: white;
          font-size: 1.3rem;
          line-height: 1.6;
          min-height: 150px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          animation: textBoxAppear 0.8s ease forwards;
          transform: translateY(30px);
          opacity: 0;
        }

        @keyframes textBoxAppear {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .typewriter-text {
          white-space: pre-wrap;
          opacity: 0;
          animation: fadeIn 1s forwards;
        }

        .typewriter-text.finished {
          animation: fadeIn 1s forwards, glow 3s infinite alternate;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes glow {
          from { text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); }
          to { text-shadow: 0 0 20px rgba(255, 204, 170, 0.9); }
        }

        .choices-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin: 0 5% 20px 5%;
          animation: popIn 0.6s ease forwards;
          transform: scale(0.8);
          opacity: 0;
        }

        @keyframes popIn {
          to { transform: scale(1); opacity: 1; }
        }

        .continue-container {
          display: flex;
          justify-content: center;
          margin: 0 5% 20px 5%;
          animation: slideUp 0.5s ease forwards;
          transform: translateY(20px);
          opacity: 0;
        }

        @keyframes slideUp {
          to { transform: translateY(0); opacity: 1; }
        }

        .game-button {
          padding: 15px 30px;
          font-size: 1.1rem;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: none;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .game-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }

        .game-button:active {
          transform: scale(0.98);
        }

        .game-button.primary {
          background: linear-gradient(45deg, #ff6b6b, #ffa500);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        .game-button.primary:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
        }

        .game-button.choice {
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          border: 2px solid rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          text-transform: none;
          font-size: 1rem;
          line-height: 1.4;
          white-space: normal;
          text-align: left;
          font-weight: normal;
        }

        .game-button.choice:hover:not(.disabled) {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .game-button.chapter {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
          font-size: 1.3rem;
          padding: 20px 40px;
        }

        .game-button.chapter:hover:not(.disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
        }

        .game-button.final {
          background: linear-gradient(45deg, #ff1744, #ff6b35, #ffd700);
          color: white;
          box-shadow: 0 6px 25px rgba(255, 23, 68, 0.6);
          animation: finalButtonPulse 2s ease-in-out infinite;
          position: relative;
          overflow: hidden;
          text-transform: none;
          font-size: 1.2rem;
        }

        .game-button.final::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(45deg);
          animation: shimmer 3s linear infinite;
        }

        @keyframes finalButtonPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 6px 25px rgba(255, 23, 68, 0.6); }
          50% { transform: scale(1.05); box-shadow: 0 8px 35px rgba(255, 23, 68, 0.8); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        .game-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .chapter-main {
            font-size: 2.5rem;
          }
          
          .chapter-sub {
            font-size: 1.5rem;
          }
          
          .text-box {
            font-size: 1.1rem;
            padding: 20px;
            margin: 0 3%;
          }
          
          .game-button {
            padding: 12px 25px;
            font-size: 1rem;
          }

          .scene-background::after {
            font-size: 1.5rem !important;
          }

          .floating-hearts .heart {
            font-size: 0.8rem;
          }

          .scene-image-container {
            width: 90vw !important;
            height: 90vw !important;
            max-width: 600px !important;
            max-height: 600px !important;
          }

          .proposal-image, .wedding-ceremony-image {
            width: 90vw !important;
            height: 90vw !important;
            max-width: 600px !important;
            max-height: 600px !important;
          }
        }

        @media (max-width: 480px) {
          .chapter-main {
            font-size: 2rem;
          }
          
          .chapter-sub {
            font-size: 1.2rem;
          }
          
          .text-box {
            font-size: 1rem;
            padding: 15px;
          }
          
          .game-button {
            padding: 10px 20px;
            font-size: 0.9rem;
          }

          .choices-container {
            gap: 10px;
          }

          .scene-image-container {
            width: 95vw !important;
            height: 95vw !important;
            max-width: 400px !important;
            max-height: 400px !important;
          }

          .proposal-image, .wedding-ceremony-image {
            width: 95vw !important;
            height: 95vw !important;
            max-width: 400px !important;
            max-height: 400px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VisualNovel;