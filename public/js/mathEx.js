class MathAdditional{

    calcVector(a,b){
        return [(b.x - a.x), ((b.y * -1) - (a.y * -1))];
    }

    scalarProductOfVectors(vectorA, vectorB){
        return (vectorA[0] * vectorB[0]) + (vectorA[1] * vectorB[1]);
    }

    vectorLength(vector){
        return Math.sqrt(Math.pow(vector[0],2) + Math.pow(vector[1],2) );
    }

    calcAngleRad(scalar, vectorALength, vectorBLength){
        return Math.acos(scalar / (vectorALength * vectorBLength));
    }

    radToDeg(rad){
        return rad * 180 / Math.PI;
    }

    calcAngleBetweenPoints(a,b,c){
        let vertorAB      = this.calcVector(a,b);
        let vectorBC      = this.calcVector(b,c);
        let scalarProduct = this.scalarProductOfVectors(vertorAB, vectorBC);
    
        let vectorsABLength = this.vectorLength(vertorAB);
        let vectorsBCLength = this.vectorLength(vectorBC);
        return this.calcAngleRad(scalarProduct, vectorsABLength, vectorsBCLength);
    }
}