document.addEventListener('DOMContentLoaded', () => {

    // --- VARIÁVEIS GLOBAIS ---
    let player = {};
    let combatState = {};
    const SAVE_KEY = 'eldoria-savegame';
    const LEADERBOARD_KEY = 'eldoria-leaderboard'; // Chave para a API simulada

    // --- BANCO DE DADOS DO JOGO ---
    const gameData = {
        items: {
            'pocao_vida_p': { name: 'Poção de Vida Pequena', type: 'consumable', effect: { type: 'heal', amount: 30 }, value: 10 },
            'espada_velha': { name: 'Espada Velha', type: 'weapon', slot: 'weapon', stats: { damage: 3 }, value: 5 },
            'galho_seco': { name: 'Galho Seco', type: 'material', value: 1 },
            'pedra_afiada': { name: 'Pedra Afiada', type: 'material', value: 2 },
            'pele_lobo': { name: 'Pele de Lobo', type: 'material', value: 4 },
            'presa_lobo': { name: 'Presa de Lobo', type: 'material', value: 6 },
            'essencia_magica': { name: 'Essência Mágica', type: 'material', value: 15 },
            'minerio_ferro': { name: 'Minério de Ferro', type: 'material', value: 8 },
            'couro': { name: 'Couro', type: 'material', value: 10 },
            'lingote_ferro': { name: 'Lingote de Ferro', type: 'material', value: 25 },
            'essencia_fogo': { name: 'Essência de Fogo', type: 'material', value: 30 },
            'gosma_slime': { name: 'Gosma de Slime', type: 'material', value: 3 },
            'mapa_rasgado': { name: 'Mapa Rasgado', type: 'material', value: 12 },
            'gema_goblin': { name: 'Gema Goblin', type: 'material', value: 100 },
            'pocao_vida_m': { name: 'Poção de Vida Média', type: 'consumable', effect: { type: 'heal', amount: 80 }, value: 25 },
            'pocao_mana_p': { name: 'Poção de Mana Pequena', type: 'consumable', effect: { type: 'mana', amount: 25 }, value: 20 },
            'elixir_forca': { name: 'Elixir da Força', type: 'consumable', effect: { type: 'buff', stat: 'strength', amount: 3, duration: 5 }, value: 50 },
            'adaga_ferro': { name: 'Adaga de Ferro', type: 'weapon', slot: 'weapon', stats: { damage: 6 }, value: 40 },
            'espada_ferro': { name: 'Espada de Ferro', type: 'weapon', slot: 'weapon', stats: { damage: 10 }, value: 120 },
            'cajado_aprendiz': { name: 'Cajado de Aprendiz', type: 'weapon', slot: 'weapon', stats: { damage: 4, intelligence: 5 }, value: 100 },
            'arco_simples': { name: 'Arco Simples', type: 'weapon', slot: 'weapon', stats: { damage: 7 }, value: 80 },
            'luvas_couro': { name: 'Luvas de Couro', type: 'armor', slot: 'hands', stats: { defense: 2 }, value: 30 },
            'elmo_ferro': { name: 'Elmo de Ferro', type: 'armor', slot: 'head', stats: { defense: 5 }, value: 150 },
            'bota_couro': { name: 'Bota de Couro', type: 'armor', slot: 'feet', stats: { defense: 2 }, value: 30 },
            'coroa_goblin': { name: 'Coroa do Chefe Goblin', type: 'armor', slot: 'head', stats: { defense: 8, strength: 3 }, value: 500 },
        },
        monsters: {
            'goblin_ladrao': { name: 'Goblin Ladrão', level: 1, hp: 30, attack: 4, xp: 10, loot: [{ id: 'pedra_afiada', chance: 0.5, min: 1, max: 2 }], gold: [2, 8] },
            'slime_verde': { name: 'Slime Verde', level: 1, hp: 25, attack: 3, xp: 8, loot: [{ id: 'gosma_slime', chance: 0.8, min: 1, max: 3 }], gold: [1, 5] },
            'lobo_cinzento': { name: 'Lobo Cinzento', level: 2, hp: 40, attack: 6, xp: 15, loot: [{ id: 'pele_lobo', chance: 0.7, min: 1, max: 2 }, { id: 'presa_lobo', chance: 0.4, min: 1, max: 1 }], gold: [5, 12] },
            'bandido': { name: 'Bandido', level: 3, hp: 55, attack: 8, xp: 25, loot: [{ id: 'mapa_rasgado', chance: 0.2, min: 1, max: 1 }, { id: 'pocao_vida_p', chance: 0.3, min: 1, max: 1 }], gold: [10, 25] },
            'elemental_fogo': { name: 'Elemental de Fogo', level: 5, hp: 70, attack: 12, xp: 40, loot: [{ id: 'essencia_fogo', chance: 0.8, min: 1, max: 3 }], gold: [20, 50] },
            'goblin_chefe': { name: 'Chefe Goblin', level: 7, hp: 150, attack: 15, xp: 100, loot: [{ id: 'gema_goblin', chance: 1.0, min: 1, max: 1 }, { id: 'coroa_goblin', chance: 0.5, min: 1, max: 1 }], gold: [50, 100] }
        },
        recipes: [
            { result: 'adaga_ferro', quantity: 1, ingredients: [{ id: 'lingote_ferro', quantity: 2 }, { id: 'couro', quantity: 1 }] },
            { result: 'pocao_vida_m', quantity: 1, ingredients: [{ id: 'pocao_vida_p', quantity: 2 }, { id: 'essencia_magica', quantity: 1 }] },
            { result: 'luvas_couro', quantity: 1, ingredients: [{ id: 'pele_lobo', quantity: 4 }] },
            { result: 'bota_couro', quantity: 1, ingredients: [{ id: 'pele_lobo', quantity: 3 }, { id: 'couro', quantity: 1 }] },
            { result: 'lingote_ferro', quantity: 1, ingredients: [{ id: 'minerio_ferro', quantity: 3 }] },
            { result: 'couro', quantity: 1, ingredients: [{ id: 'pele_lobo', quantity: 2 }] },
            { result: 'espada_ferro', quantity: 1, ingredients: [{ id: 'lingote_ferro', quantity: 5 }, { id: 'couro', quantity: 2 }] },
            { result: 'elmo_ferro', quantity: 1, ingredients: [{ id: 'lingote_ferro', quantity: 4 }] },
            { result: 'pocao_mana_p', quantity: 1, ingredients: [{ id: 'essencia_magica', quantity: 2 }, { id: 'galho_seco', quantity: 1 }] },
            { result: 'arco_simples', quantity: 1, ingredients: [{ id: 'galho_seco', quantity: 5 }, { id: 'couro', quantity: 1 }] },
        ],
        maps: [
            {
                id: 'floresta_sussurrante', name: 'Floresta Sussurrante', description: 'Uma floresta densa e antiga, cheia de mistérios.',
                subAreas: [
                    { id: 'clareira_inicial', name: 'Clareira Inicial', minLevel: 1, monsters: ['goblin_ladrao', 'slime_verde'], loot: [{ id: 'galho_seco', chance: 0.3 }, { id: 'pedra_afiada', chance: 0.1 }] },
                    { id: 'trilha_lobo', name: 'Trilha do Lobo', minLevel: 2, monsters: ['lobo_cinzento', 'goblin_ladrao'], loot: [{ id: 'pele_lobo', chance: 0.1 }] },
                    { id: 'coracao_floresta', name: 'Coração da Floresta', minLevel: 4, monsters: ['lobo_cinzento'], loot: [{ id: 'essencia_magica', chance: 0.15 }] },
                    { id: 'caverna_goblin', name: 'Caverna do Chefe Goblin', minLevel: 6, monsters: ['goblin_chefe'], loot: [] }
                ]
            },
            {
                id: 'planicies_quebradas', name: 'Planícies Quebradas', description: 'Vastas planícies rochosas, lar de bestas selvagens.',
                subAreas: [
                    { id: 'pedras_vento', name: 'Colina das Pedras do Vento', minLevel: 1, monsters: ['goblin_ladrao'], loot: [{ id: 'minerio_ferro', chance: 0.2 }] },
                    { id: 'campo_aberto', name: 'Campo Aberto', minLevel: 3, monsters: ['lobo_cinzento', 'bandido'], loot: [] },
                    { id: 'pico_escaldante', name: 'Pico Escaldante', minLevel: 5, monsters: ['elemental_fogo', 'bandido'], loot: [{ id: 'essencia_fogo', chance: 0.05 }] }
                ]
            },
            {
                id: 'vila_abandonada', name: 'Vila de Alvorada', description: 'Uma vila que já foi próspera, agora um ponto de encontro para aventureiros.',
                subAreas: [
                     { id: 'praca_central', name: 'Praça Central', minLevel: 1, isSafe: true, monsters: [], loot: [] }
                ]
            }
        ],
        shop: [
            { id: 'pocao_vida_p', price: 20 },
            { id: 'pocao_mana_p', price: 30 },
            { id: 'adaga_ferro', price: 80 },
            { id: 'luvas_couro', price: 60 },
            { id: 'minerio_ferro', price: 15 },
        ]
    };

    // --- SELETORES DE ELEMENTOS DOM ---
    const screens = document.querySelectorAll('.screen');
    const gameLog = document.getElementById('game-log');
    const statsDisplay = document.getElementById('stats-display');
    const worldMapContainer = document.getElementById('world-map-container');
    const locationContentContainer = document.getElementById('location-content');
    const inventoryGrid = document.getElementById('inventory-grid');
    const craftingRecipes = document.getElementById('crafting-recipes');
    const actionButtonsContainer = document.getElementById('action-buttons');
    const combatActionsContainer = document.getElementById('combat-actions');
    const skillPointsDisplay = document.getElementById('skill-points-display');

    // --- FUNÇÕES PRINCIPAIS ---

    function init() {
        if (localStorage.getItem(SAVE_KEY)) {
            document.getElementById('load-game-btn').style.display = 'inline-block';
        }
        updateLeaderboardDisplay();
        switchScreen('start-screen');
        setupEventListeners();
    }

    function switchScreen(screenId) {
        screens.forEach(screen => screen.classList.toggle('active', screen.id === screenId));
    }

    function toggleModal(modalId, show = true) {
        document.getElementById(modalId)?.classList.toggle('active', show);
    }
    
    function startGameWithPlayer(loadedPlayer) {
        player = loadedPlayer;
        updateAllUI();
        logMessage(`Bem-vindo de volta, ${player.name}!`, 'system');
        
        if(player.currentMap) {
            displaySubAreas(player.currentMap);
        } else {
            displayMapSelection();
        }
        switchScreen('game-screen');
    }

    function createCharacter(e) {
        e.preventDefault();
        const name = document.getElementById('player-name').value;
        if (!name) {
            alert('Por favor, digite o nome do seu herói!');
            return;
        }

        player = {
            name: name,
            race: document.getElementById('player-race').value,
            class: document.getElementById('player-class').value,
            level: 1, xp: 0, xpToNextLevel: 100,
            hp: 100, maxHp: 100, mp: 50, maxMp: 50,
            skillPoints: 0,
            stats: { strength: 10, dexterity: 10, intelligence: 10 },
            inventory: [],
            equipment: { weapon: 'espada_velha', head: null, hands: null, feet: null },
            gold: 20,
            currentMap: null, currentSubArea: null
        };
        addItemToInventory('pocao_vida_p', 3);
        addItemToInventory('espada_velha', 1);
        
        submitScoreToLeaderboard(player.name, player.level);

        updateAllUI();
        displayMapSelection();
        switchScreen('game-screen');
        logMessage(`Um novo herói, ${player.name}, começa sua jornada.`, 'system');
    }

    // --- LÓGICA DE NAVEGAÇÃO E MAPA ---

    function displayMapSelection() {
        document.getElementById('world-map-title').textContent = 'Escolha sua Região';
        const mapLocationsDiv = document.getElementById('world-map-locations');
        mapLocationsDiv.innerHTML = '';
        locationContentContainer.style.display = 'none';
        worldMapContainer.style.display = 'block';
        document.getElementById('back-to-maps-btn').style.display = 'none';

        gameData.maps.forEach(map => {
            const mapButton = document.createElement('button');
            mapButton.textContent = map.name;
            mapButton.title = map.description;
            mapButton.addEventListener('click', () => selectMap(map.id));
            mapLocationsDiv.appendChild(mapButton);
        });
    }

    function selectMap(mapId) {
        player.currentMap = mapId;
        displaySubAreas(mapId);
    }

    function displaySubAreas(mapId) {
        const map = gameData.maps.find(m => m.id === mapId);
        const locationsDiv = document.getElementById('world-map-locations');
        document.getElementById('world-map-title').textContent = map.name;
        locationsDiv.innerHTML = '';
        document.getElementById('back-to-maps-btn').style.display = 'block';

        locationContentContainer.style.display = 'none';
        worldMapContainer.style.display = 'block';

        map.subAreas.forEach(area => {
            const areaButton = document.createElement('button');
            areaButton.textContent = `${area.name} (Nível ${area.minLevel}+)`;
            if (player.level < area.minLevel) {
                areaButton.disabled = true;
                areaButton.title = `Requer nível ${area.minLevel}`;
            }
            areaButton.addEventListener('click', () => enterSubArea(area));
            locationsDiv.appendChild(areaButton);
        });
    }

    function enterSubArea(area) {
        player.currentSubArea = area;
        worldMapContainer.style.display = 'none';
        locationContentContainer.style.display = 'block';
        document.getElementById('location-title').textContent = area.name;
        gameLog.innerHTML = '';
        logMessage(`Você adentra ${area.name}.`, 'info');
        
        actionButtonsContainer.innerHTML = '';
        if (area.isSafe) {
            actionButtonsContainer.innerHTML = `
                <button id="rest-action-btn">Descansar</button>
                <button id="shop-btn">Ir para Loja</button>
                <button id="back-to-areas-btn">Voltar ao Mapa</button>
            `;
            document.getElementById('shop-btn').addEventListener('click', () => { updateShopUI(); toggleModal('shop-modal'); });
        } else {
            actionButtonsContainer.innerHTML = `
                <button id="explore-action-btn">Explorar</button>
                <button id="back-to-areas-btn">Voltar ao Mapa</button>
            `;
            document.getElementById('explore-action-btn').addEventListener('click', explore);
        }
        if (document.getElementById('rest-action-btn')) {
            document.getElementById('rest-action-btn').addEventListener('click', rest);
        }
        document.getElementById('back-to-areas-btn').addEventListener('click', () => displaySubAreas(player.currentMap));

        saveGame();
    }

    // --- LÓGICA DE JOGO (EXPLORAÇÃO, COMBATE, ETC.) ---

    function logMessage(message, type = 'info') {
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        logEntry.className = `log-${type}`;
        gameLog.appendChild(logEntry);
        gameLog.scrollTop = gameLog.scrollHeight;
    }

    function combatLogMessage(message, type = 'info') {
        const log = document.getElementById('combat-log');
        const entry = document.createElement('p');
        entry.textContent = message;
        entry.className = `log-${type}`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    function explore() {
        const area = player.currentSubArea;
        if (!area || area.isSafe) return;
        logMessage('Você explora os arredores...', 'info');

        const eventRoll = Math.random();
        if (area.monsters.length > 0 && eventRoll < 0.55) {
            const monsterId = area.monsters[Math.floor(Math.random() * area.monsters.length)];
            startCombat(monsterId);
            return;
        }
        if (area.loot.length > 0 && eventRoll < 0.70) {
            const foundLoot = area.loot.find(l => Math.random() < l.chance);
            if (foundLoot) {
                const itemName = gameData.items[foundLoot.id].name;
                logMessage(`Você encontrou ${itemName} no chão!`, 'loot');
                addItemToInventory(foundLoot.id, 1);
                return;
            }
        }
        if (eventRoll < 0.90) {
             const specialEventRoll = Math.random();
             if (specialEventRoll < 0.4) {
                 const goldFound = Math.floor(Math.random() * 15) + 5;
                 player.gold += goldFound;
                 logMessage(`Você encontrou uma pequena bolsa com ${goldFound} moedas de ouro!`, 'loot');
                 updateAllUI();
             } else if (specialEventRoll < 0.7) {
                 logMessage('Você encontra um baú de tesouro trancado!', 'event');
                 if(Math.random() < 0.6) {
                    const goldFound = Math.floor(Math.random() * 40) + 10;
                    player.gold += goldFound;
                    logMessage(`Você conseguiu abrir o baú e encontrou ${goldFound} moedas de ouro!`, 'loot');
                    updateAllUI();
                 } else {
                    logMessage('Você não conseguiu abrir o baú.', 'danger');
                 }
             } else {
                player.hp = Math.max(1, player.hp - 10);
                logMessage('Você pisa em uma armadilha simples e perde 10 de vida.', 'danger');
                updateAllUI();
             }
             return;
        }
        
        logMessage('A área parece tranquila por enquanto.', 'success');
    }

    function rest() {
        if (combatState.active) return;
        if (player.currentSubArea.id !== 'praca_central') {
            logMessage('Você só pode descansar na segurança da Praça Central em Alvorada.', 'danger');
            return;
        }
        player.hp = player.maxHp;
        player.mp = player.maxMp;
        logMessage('Você descansa na vila e recupera totalmente suas forças.', 'success');
        updateAllUI();
    }

    function startCombat(monsterId) {
        const monsterData = gameData.monsters[monsterId];
        combatState = {
            active: true,
            playerTurn: true,
            monster: { ...monsterData, id: monsterId, hp: monsterData.hp, maxHp: monsterData.hp }
        };
        switchScreen('combat-screen');
        document.getElementById('combat-log').innerHTML = '';
        combatLogMessage(`Você entrou em combate contra ${combatState.monster.name}!`, 'system');
        updateCombatUI();
        updateCombatActionsUI();
    }

    function getPlayerTotalStats() {
        const totalStats = { ...player.stats, damage: 0, defense: 0 };
        for (const slot in player.equipment) {
            const itemId = player.equipment[slot];
            if (itemId) {
                const itemData = gameData.items[itemId];
                if (itemData.stats) {
                    for (const stat in itemData.stats) {
                        totalStats[stat] = (totalStats[stat] || 0) + itemData.stats[stat];
                    }
                }
            }
        }
        return totalStats;
    }

    function playerAttack() {
        if (!combatState.active || !combatState.playerTurn) return;
        const pStats = getPlayerTotalStats();
        const damage = Math.max(1, Math.floor(pStats.strength / 2) + pStats.damage);
        
        combatState.monster.hp -= damage;
        combatLogMessage(`Você ataca e causa ${damage} de dano.`, 'info');
        
        endPlayerTurn();
    }

    function useSkill() {
        if (!combatState.active || !combatState.playerTurn) return;

        const pClass = player.class;
        let skill = {};
        
        // Define skills based on class
        switch(pClass) {
            case 'Guerreiro': skill = { name: 'Ataque Poderoso', cost: 15, execute: () => {
                const pStats = getPlayerTotalStats();
                const damage = Math.max(1, Math.floor(pStats.strength * 1.5) + pStats.damage);
                combatState.monster.hp -= damage;
                combatLogMessage(`Você usa Ataque Poderoso, causando ${damage} de dano massivo!`, 'success');
            }}; break;
            case 'Mago': skill = { name: 'Bola de Fogo', cost: 20, execute: () => {
                const pStats = getPlayerTotalStats();
                const damage = Math.max(1, Math.floor(pStats.intelligence * 2));
                combatState.monster.hp -= damage;
                combatLogMessage(`Você lança uma Bola de Fogo, causando ${damage} de dano mágico!`, 'success');
            }}; break;
            case 'Clero': skill = { name: 'Curar', cost: 25, execute: () => {
                const pStats = getPlayerTotalStats();
                const healing = Math.floor(pStats.intelligence * 1.5) + 20;
                player.hp = Math.min(player.maxHp, player.hp + healing);
                combatLogMessage(`Você usa Curar, recuperando ${healing} de HP.`, 'success');
            }}; break;
            // Add other classes here
            default: combatLogMessage(`Sua classe ${pClass} não possui uma habilidade de combate.`, 'danger'); return;
        }

        if (player.mp >= skill.cost) {
            player.mp -= skill.cost;
            skill.execute();
            endPlayerTurn();
        } else {
            combatLogMessage(`Você não tem mana suficiente para usar ${skill.name}.`, 'danger');
        }
    }

    function monsterAttack() {
        if (!combatState.active) return;
        const pStats = getPlayerTotalStats();
        const damage = Math.max(1, combatState.monster.attack - pStats.defense);
        player.hp -= damage;
        combatLogMessage(`${combatState.monster.name} ataca e causa ${damage} de dano.`, 'danger');
        
        if (player.hp <= 0) {
            player.hp = 0;
            loseCombat();
            return;
        }
        updateCombatUI();
        combatState.playerTurn = true;
        updateCombatActionsUI();
    }

    function endPlayerTurn() {
        if (combatState.monster.hp <= 0) {
            winCombat();
            return;
        }
        updateCombatUI();
        combatState.playerTurn = false;
        updateCombatActionsUI();
        setTimeout(monsterAttack, 1000);
    }

    function winCombat() {
        combatLogMessage(`Você derrotou ${combatState.monster.name}!`, 'success');
        const monster = combatState.monster;
        player.xp += monster.xp;
        combatLogMessage(`Você ganhou ${monster.xp} XP.`, 'system');
        
        const goldGained = Math.floor(Math.random() * (monster.gold[1] - monster.gold[0] + 1)) + monster.gold[0];
        if (goldGained > 0) {
            player.gold += goldGained;
            combatLogMessage(`Você obteve ${goldGained} moedas de ouro!`, 'loot');
        }

        monster.loot.forEach(drop => {
            if (Math.random() < drop.chance) {
                const quantity = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
                addItemToInventory(drop.id, quantity);
                combatLogMessage(`Você obteve ${quantity}x ${gameData.items[drop.id].name}!`, 'loot');
            }
        });
        
        if (player.xp >= player.xpToNextLevel) {
            levelUp();
        }
        endCombat();
    }

    function loseCombat() {
        combatLogMessage('Você foi derrotado!', 'danger');
        player.hp = 1;
        const safeMap = gameData.maps.find(m => m.id === 'vila_abandonada');
        const safeArea = safeMap.subAreas[0];
        player.currentMap = safeMap.id;
        player.currentSubArea = safeArea;
        
        combatLogMessage('Você desmaia e acorda na segurança da Praça Central...', 'system');
        endCombat(true);
    }

    function endCombat(wasDefeated = false) {
        combatState = { active: false };
        setTimeout(() => {
            switchScreen('game-screen');
            if(wasDefeated){
                enterSubArea(player.currentSubArea);
            }
            updateAllUI();
        }, 3000);
    }

    function levelUp() {
        player.level++;
        player.xp -= player.xpToNextLevel;
        player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);
        player.maxHp += 10;
        player.maxMp += 5;
        player.hp = player.maxHp;
        player.mp = player.maxMp;
        player.skillPoints += 1;
        
        const levelUpMsg = `Você subiu para o nível ${player.level}! Suas forças foram restauradas e você ganhou 1 Ponto de Atributo!`;
        logMessage(levelUpMsg, 'system');
        if (combatState.active) {
            combatLogMessage(levelUpMsg, 'system');
        }
        
        submitScoreToLeaderboard(player.name, player.level);
    }
    
    function allocateStat(stat) {
        if(player.skillPoints > 0) {
            player.skillPoints--;
            player.stats[stat]++;
            updateAllUI();
        }
    }

    // --- LÓGICA DE ITENS, INVENTÁRIO, CRIAÇÃO E LOJA ---
    
    function addItemToInventory(itemId, quantity) {
        if (!gameData.items[itemId]) return;
        const existingItem = player.inventory.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            player.inventory.push({ id: itemId, quantity: quantity });
        }
    }

    function removeItemFromInventory(itemId, quantity) {
        const itemIndex = player.inventory.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            player.inventory[itemIndex].quantity -= quantity;
            if (player.inventory[itemIndex].quantity <= 0) {
                player.inventory.splice(itemIndex, 1);
            }
        }
    }

    function useItem(itemId) {
        const itemData = gameData.items[itemId];
        if (!itemData) return;
    
        if (itemData.type === 'weapon' || itemData.type === 'armor') {
            const slot = itemData.slot;
            const oldItem = player.equipment[slot];
            if (oldItem) {
                addItemToInventory(oldItem, 1);
            }
            player.equipment[slot] = itemId;
            removeItemFromInventory(itemId, 1);
            logMessage(`Você equipou ${itemData.name}.`, 'system');
        } else if (itemData.type === 'consumable') {
            const effect = itemData.effect;
            if (effect.type === 'heal') {
                player.hp = Math.min(player.maxHp, player.hp + effect.amount);
                logMessage(`Você usou ${itemData.name} e recuperou ${effect.amount} de HP.`, 'success');
            } else if (effect.type === 'mana') {
                player.mp = Math.min(player.maxMp, player.mp + effect.amount);
                logMessage(`Você usou ${itemData.name} e recuperou ${effect.amount} de MP.`, 'success');
            }
            removeItemFromInventory(itemId, 1);
        }
        updateAllUI();
    }

    function craftItem(resultItemId) {
        const recipe = gameData.recipes.find(r => r.result === resultItemId);
        if (!recipe) return;
        const canCraft = recipe.ingredients.every(ing => {
            const playerItem = player.inventory.find(i => i.id === ing.id);
            return playerItem && playerItem.quantity >= ing.quantity;
        });

        if (canCraft) {
            recipe.ingredients.forEach(ing => removeItemFromInventory(ing.id, ing.quantity));
            addItemToInventory(recipe.result, recipe.quantity);
            logMessage(`Você criou ${gameData.items[recipe.result].name}!`, 'success');
            updateCraftingUI();
            updateInventoryUI();
        } else {
            logMessage('Você não tem os materiais necessários.', 'danger');
            updateCraftingUI();
        }
    }
    
    function buyItem(itemId) {
        const shopItem = gameData.shop.find(item => item.id === itemId);
        if (!shopItem) return;

        if(player.gold >= shopItem.price) {
            player.gold -= shopItem.price;
            addItemToInventory(itemId, 1);
            logMessage(`Você comprou ${gameData.items[itemId].name}.`, 'success');
            updateShopUI();
            updateAllUI();
        } else {
            logMessage('Ouro insuficiente!', 'danger');
        }
    }

    // --- FUNÇÕES DE COMBATE ADICIONAIS ---

    function showCombatPotions() {
        if (!combatState.playerTurn) return;
        const usablePotions = player.inventory.filter(item => {
            const itemData = gameData.items[item.id];
            return itemData.type === 'consumable' && (itemData.effect.type === 'heal' || itemData.effect.type === 'mana');
        });

        if (usablePotions.length === 0) {
            combatLogMessage("Você não tem poções para usar.", "danger");
            return;
        }

        combatActionsContainer.innerHTML = '';
        usablePotions.forEach(potion => {
            const itemData = gameData.items[potion.id];
            const button = document.createElement('button');
            button.textContent = `Usar ${itemData.name} (x${potion.quantity})`;
            button.onclick = () => usePotionInCombat(potion.id);
            combatActionsContainer.appendChild(button);
        });

        const backButton = document.createElement('button');
        backButton.textContent = 'Voltar';
        backButton.onclick = updateCombatActionsUI;
        combatActionsContainer.appendChild(backButton);
    }

    function usePotionInCombat(itemId) {
        const itemData = gameData.items[itemId];
        if (!itemData || !combatState.playerTurn) return;

        const effect = itemData.effect;
        if (effect.type === 'heal') {
            const oldHp = player.hp;
            player.hp = Math.min(player.maxHp, player.hp + effect.amount);
            combatLogMessage(`Você usou ${itemData.name} e recuperou ${player.hp - oldHp} de HP.`, 'success');
        } else if (effect.type === 'mana') {
            const oldMp = player.mp;
            player.mp = Math.min(player.maxMp, player.mp + effect.amount);
            combatLogMessage(`Você usou ${itemData.name} e recuperou ${player.mp - oldMp} de MP.`, 'success');
        }
        
        removeItemFromInventory(itemId, 1);
        endPlayerTurn();
    }

    // --- ATUALIZAÇÃO DA INTERFACE DO USUÁRIO (UI) ---

    function updateAllUI(){
        updateStatsUI();
        updateInventoryUI();
        updateCombatUI();
    }

    function updateStatsUI() {
        if (!player.name) return;
        
        const totalStats = getPlayerTotalStats();
        
        statsDisplay.innerHTML = `
            <p><strong>Nome:</strong> <span>${player.name}</span></p>
            <p><strong>Raça/Classe:</strong> <span>${player.race} ${player.class}</span></p>
            <p><strong>Nível:</strong> <span>${player.level} (${player.xp} / ${player.xpToNextLevel} XP)</span></p>
            <p><strong>HP:</strong> <span>${player.hp} / ${player.maxHp}</span></p>
            <p><strong>MP:</strong> <span>${player.mp} / ${player.maxMp}</span></p>
            <p><strong>Ouro:</strong> <span>${player.gold} 🪙</span></p>
            <hr>
            <p><strong>Força:</strong> <span>${totalStats.strength} (${player.stats.strength} base)</span></p>
            <p><strong>Destreza:</strong> <span>${totalStats.dexterity} (${player.stats.dexterity} base)</span></p>
            <p><strong>Inteligência:</strong> <span>${totalStats.intelligence} (${player.stats.intelligence} base)</span></p>
            <p><strong>Defesa Total:</strong> <span>${totalStats.defense}</span></p>
            <p><strong>Dano da Arma:</strong> <span>${totalStats.damage}</span></p>`;

        if (player.skillPoints > 0) {
            skillPointsDisplay.innerHTML = `
                <h4>Você tem ${player.skillPoints} Ponto(s) de Atributo!</h4>
                <div class="stat-allocation"><span>Força: ${player.stats.strength}</span> <button data-stat="strength">+</button></div>
                <div class="stat-allocation"><span>Destreza: ${player.stats.dexterity}</span> <button data-stat="dexterity">+</button></div>
                <div class="stat-allocation"><span>Inteligência: ${player.stats.intelligence}</span> <button data-stat="intelligence">+</button></div>
            `;
            skillPointsDisplay.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', (e) => allocateStat(e.target.dataset.stat));
            });
        } else {
            skillPointsDisplay.innerHTML = '';
        }
        
        for(const slot of ['weapon', 'head', 'hands', 'feet']) {
            const equipId = player.equipment[slot];
            const equipName = equipId ? gameData.items[equipId].name : 'Nenhum';
            document.getElementById(`equipped-${slot}`).textContent = equipName;
        }
    }

    function updateInventoryUI() {
        inventoryGrid.innerHTML = '';
        if (player.inventory && player.inventory.length > 0) {
            player.inventory.forEach(item => {
                const itemData = gameData.items[item.id];
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                let buttonText = (itemData.type === 'weapon' || itemData.type === 'armor') ? 'Equipar' : 'Usar';
                itemDiv.innerHTML = `
                    <span>${itemData.name} (x${item.quantity})</span>
                    <button data-item-id="${item.id}">${buttonText}</button>`;
                inventoryGrid.appendChild(itemDiv);
            });
            inventoryGrid.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', (e) => useItem(e.target.dataset.itemId));
            });
        } else {
            inventoryGrid.innerHTML = '<p>Seu inventário está vazio.</p>';
        }
        updateStatsUI();
    }
    
    function updateCraftingUI() {
        craftingRecipes.innerHTML = '';
        gameData.recipes.forEach(recipe => {
            const resultItem = gameData.items[recipe.result];
            let canCraft = true;
            let materialsHtml = '<ul>';
            recipe.ingredients.forEach(ing => {
                const playerItem = player.inventory.find(i => i.id === ing.id);
                const hasEnough = playerItem && playerItem.quantity >= ing.quantity;
                if (!hasEnough) canCraft = false;
                materialsHtml += `<li class="${hasEnough ? 'has-material' : 'missing-material'}">${gameData.items[ing.id].name}: ${ing.quantity}</li>`;
            });
            materialsHtml += '</ul>';
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <div class="recipe-title">Criar: ${resultItem.name} x${recipe.quantity}</div>
                <div class="recipe-materials">${materialsHtml}</div>
                <button data-recipe-result="${recipe.result}" ${canCraft ? '' : 'disabled'}>Criar</button>`;
            craftingRecipes.appendChild(recipeDiv);
        });
        craftingRecipes.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => craftItem(e.target.dataset.recipeResult));
        });
    }
    
    function updateShopUI() {
        const shopContainer = document.getElementById('shop-items');
        shopContainer.innerHTML = '';
        document.getElementById('player-gold-shop').textContent = player.gold;

        gameData.shop.forEach(shopItem => {
            const itemData = gameData.items[shopItem.id];
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';
            itemDiv.innerHTML = `
                <span>${itemData.name}</span>
                <div>
                    <span class="price">${shopItem.price} 🪙</span>
                    <button data-item-id="${shopItem.id}" ${player.gold < shopItem.price ? 'disabled' : ''}>Comprar</button>
                </div>
            `;
            shopContainer.appendChild(itemDiv);
        });

        shopContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => buyItem(e.target.dataset.itemId));
        });
    }

    function updateCombatUI() {
        if (!player || !player.name) return;
        const playerDiv = document.getElementById('combat-player');
        playerDiv.innerHTML = `
            <h3>${player.name}</h3>
            <p>HP: ${player.hp} / ${player.maxHp}</p>
            <div class="hp-bar"><div class="hp-fill" style="width: ${(player.hp / player.maxHp) * 100}%;"></div></div>
            <p>MP: ${player.mp} / ${player.maxMp}</p>
            <div class="mp-bar"><div class="mp-fill" style="width: ${(player.mp / player.maxMp) * 100}%;"></div></div>`;

        if (combatState.active) {
            const monster = combatState.monster;
            const monsterDiv = document.getElementById('combat-monster');
            monsterDiv.innerHTML = `
                <h3>${monster.name}</h3>
                <p>HP: ${monster.hp} / ${monster.maxHp}</p>
                <div class="hp-bar"><div class="hp-fill" style="width: ${(monster.hp / monster.maxHp) * 100}%;"></div></div>`;
        }
    }

    function updateCombatActionsUI() {
        combatActionsContainer.innerHTML = `
            <button id="attack-btn">Atacar</button>
            <button id="skill-btn">Habilidade</button>
            <button id="potion-btn">Poção</button>
        `;
        document.getElementById('attack-btn').addEventListener('click', playerAttack);
        document.getElementById('skill-btn').addEventListener('click', useSkill);
        document.getElementById('potion-btn').addEventListener('click', showCombatPotions);
        
        if (combatState.active && !combatState.playerTurn) {
            combatActionsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);
        }
    }

    // --- API SIMULADA PARA PLACAR DE LÍDERES ---
    
    function getLeaderboard() {
        try {
            const board = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
            return board;
        } catch {
            return [];
        }
    }
    
    function submitScoreToLeaderboard(name, level) {
        let board = getLeaderboard();
        const playerIndex = board.findIndex(p => p.name === name);

        if (playerIndex > -1) {
            if (level > board[playerIndex].level) {
                board[playerIndex].level = level;
            }
        } else {
            board.push({ name, level });
        }
        
        board.sort((a, b) => b.level - a.level);
        board = board.slice(0, 5);

        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
        updateLeaderboardDisplay();
    }
    
    function updateLeaderboardDisplay() {
        const board = getLeaderboard();
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = '';
        if (board.length === 0) {
            list.innerHTML = '<li>Nenhuma lenda registrada.</li>';
        } else {
            board.forEach(player => {
                const li = document.createElement('li');
                li.textContent = `${player.name} - Nível ${player.level}`;
                list.appendChild(li);
            });
        }
    }

    // --- FUNÇÕES DE SAVE, LOAD, EXPORT, IMPORT ---

    function saveGame() {
        if (player && player.name) {
            try {
                localStorage.setItem(SAVE_KEY, JSON.stringify(player));
                logMessage('Progresso salvo automaticamente.', 'system');
            } catch (error) {
                console.error("Falha ao salvar o jogo:", error);
                logMessage('Houve um erro ao salvar o progresso.', 'danger');
            }
        }
    }

    function loadGame() {
        try {
            const savedData = localStorage.getItem(SAVE_KEY);
            if (savedData) {
                const loadedPlayer = JSON.parse(savedData);
                startGameWithPlayer(loadedPlayer);
            } else {
                alert('Nenhum jogo salvo encontrado!');
            }
        } catch (error) {
            console.error("Falha ao carregar o jogo:", error);
            alert('O arquivo de save está corrompido e não pôde ser carregado.');
            localStorage.removeItem(SAVE_KEY);
        }
    }

    function exportSave() {
        if (!player || !player.name) {
            alert("Não há personagem para exportar!");
            return;
        }
        const dataStr = JSON.stringify(player, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${player.name.replace(/\s+/g, '_')}_save.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        logMessage('Arquivo de save exportado com sucesso!', 'success');
    }

    function importSave(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedPlayer = JSON.parse(e.target.result);
                if (importedPlayer.name && importedPlayer.stats && importedPlayer.inventory) {
                    startGameWithPlayer(importedPlayer);
                } else {
                    alert('Arquivo de save inválido.');
                }
            } catch (error) {
                alert('Erro ao ler o arquivo de save. Ele está corrompido?');
                console.error("Erro ao importar:", error);
            }
        };
        reader.readAsText(file);
    }
    
    // --- SETUP DE EVENT LISTENERS ---

    function setupEventListeners() {
        document.getElementById('start-game-btn').addEventListener('click', () => switchScreen('character-creation-screen'));
        document.getElementById('load-game-btn').addEventListener('click', loadGame);
        document.getElementById('character-form').addEventListener('submit', createCharacter);
        
        document.getElementById('import-hero-btn').addEventListener('click', () => document.getElementById('import-file-input').click());
        document.getElementById('import-file-input').addEventListener('change', importSave);

        document.getElementById('back-to-maps-btn').addEventListener('click', displayMapSelection);
        
        document.getElementById('inventory-btn').addEventListener('click', () => { updateInventoryUI(); toggleModal('inventory-modal', true); });
        document.getElementById('crafting-btn').addEventListener('click', () => { updateCraftingUI(); toggleModal('crafting-modal', true); });
        document.getElementById('stats-btn').addEventListener('click', () => { updateStatsUI(); toggleModal('stats-modal', true); });
        document.getElementById('save-game-btn').addEventListener('click', saveGame);
        document.getElementById('export-save-btn').addEventListener('click', exportSave);

        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => toggleModal(e.target.closest('.modal').id, false));
        });
    }

    init();
});