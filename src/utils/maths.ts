export function distanceTravelledByBall(x:number,y:number) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export function joyStickAngle(x:number,y:number) {
    const angle = getAngle(-y,x)
    return isNaN(angle) ? 0 : angle;
}

export function getAngle(coordY: number, coordX: number) {
        const angle = Math.atan(Math.abs(coordY / coordX));
        
        if (coordX > 0 && coordY > 0) {
          return angle
        } else if (coordX < 0 && coordY > 0) {
          return Math.PI - angle
        } else if (coordX < 0 && coordY < 0) {
          return Math.PI + angle
        } else {
          return 2 * Math.PI - angle
        }
      }