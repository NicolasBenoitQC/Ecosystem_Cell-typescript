import React, {useState} from 'react';
import { OriginX, OriginY, WidthSvgViewBox } from '../svg-setting';

export const AxisRotationStem: React.FC = () => {
    const [originX] = useState(OriginX);
    const originY = OriginY;
    const radiusAxisRotation = (WidthSvgViewBox/2)/2;
    return (
        <svg>
            <circle className='axis-of-rotation-of-cells'
                cx={originX}
                cy={originY}
                r={radiusAxisRotation}
                fill='none'
                stroke='white'
                strokeWidth='0.1'
            />
        </svg>
    )
}