import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {

    const { 
      PlayerOneAttack,
      PlayerTwoAttack,
      PlayerOneBlock,
      PlayerTwoBlock,
      PlayerOneCriticalHitCombination: PlayerOneCombo,
      PlayerTwoCriticalHitCombination: PlayerTwoCombo
    } = controls;
    const firstFighterInitialHealth = firstFighter.health;
    const secondFighterInitialHealth = secondFighter.health;
    let playerOneTimestamp = 0;
    let playerTwoTimestamp = 0;
    let pressed = new Set();
    // 
    const onKeyup = (event) => pressed.delete(event.code);

    const onKeydown = (event) => {
      let damage = 0;

      pressed.add(event.code);

      switch (event.code) {
        case PlayerOneAttack: {
          if (pressed.has(PlayerOneBlock)) return
          damage = pressed.has(PlayerOneBlock) ? 0 : getDamage(firstFighter, secondFighter);
          secondFighter.health -= damage;
          const healthIndicator = document.getElementById(`right-fighter-indicator`);
          healthIndicator.style.width = secondFighter.health <= 0 
            ? '0' 
            : `${Math.trunc(secondFighter.health / secondFighterInitialHealth * 100)}%`
          break;
        }
        case PlayerTwoAttack: {
          if (pressed.has(PlayerTwoBlock)) return
          damage = pressed.has(PlayerOneBlock) ? 0 : getDamage(secondFighter, firstFighter);
          firstFighter.health -= damage;
          const healthIndicator = document.getElementById(`left-fighter-indicator`);
          healthIndicator.style.width = firstFighter.health <= 0 
            ? '0' 
            : `${Math.trunc(firstFighter.health / firstFighterInitialHealth * 100)}%`
          break;
        }
        case PlayerOneCombo.find(el => el === event.code): {
          const isPlayerOneCombo = PlayerOneCombo.every(el => pressed.has(el))
          if (isPlayerOneCombo && ((event.timeStamp - playerOneTimestamp) > 10000)) {
            playerOneTimestamp = event.timeStamp;
            damage = firstFighter.attack * 2
            secondFighter.health -= damage;
            const healthIndicator = document.getElementById(`right-fighter-indicator`);
            healthIndicator.style.width = secondFighter.health <= 0 
              ? '0' 
              : `${Math.trunc(secondFighter.health / secondFighterInitialHealth * 100)}%`
          } else {
            return
          }
          break;
        }
        case PlayerTwoCombo.find(el => el === event.code): {
          const isPlayerTwoCombo = PlayerTwoCombo.every(el => pressed.has(el))
          if (isPlayerTwoCombo && ((event.timeStamp - playerTwoTimestamp) > 10000)) {
            playerTwoTimestamp = event.timeStamp;
            damage = secondFighter.attack * 2
            firstFighter.health -= damage;
            const healthIndicator = document.getElementById(`left-fighter-indicator`);
            healthIndicator.style.width = firstFighter.health <= 0 
              ? '0' 
              : `${Math.trunc(firstFighter.health / firstFighterInitialHealth * 100)}%`
          } else {
            return
          }
          break;
        }
        default:
      }
      if (firstFighter.health <= 0) {
        window.removeEventListener('keydown', onKeydown)
        window.removeEventListener('keyup', onKeyup)
        firstFighter.health = firstFighterInitialHealth
        resolve(secondFighter.name);
      } else if (secondFighter.health <= 0) {
        window.removeEventListener('keydown', onKeydown)
        window.removeEventListener('keyup', onKeyup)
        secondFighter.health = secondFighterInitialHealth
        resolve(firstFighter)
      }
    }
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('keyup', onKeyup)
  });
}

export function getDamage(attacker, defender) {
  // return damage
  const damage = getHitPower(attacker) - getBlockPower(defender); 
  return damage > 0 ? damage : 0 
}

export function getHitPower(fighter) { 
  // return hit power
  const hitPower = fighter.attack * (Math.random() + 1); 
  return hitPower 
}

export function getBlockPower(fighter) { 
  // return block power
  if (!fighter) return 0
  const blockPower = fighter.defense * (Math.random() + 1);
  return blockPower
}
