type MindMap = {_id: string;
    title: string;
    description: string;
    active: boolean;
}

type Cell = {
    _id?: string;
    title: string  | undefined;
    description: string | undefined;
    position: number;
    idStemCell: string;
    stemCell: boolean;
};

type SchemaCell = {
    title: string;
    description: string;
    position: number;
    idStemCell: string;
    stemCell: boolean;
};

type StemCell = {
    _id: string;
    title: string;
    description: string;
    position: number;
    idStemCell: string;
    stemCell: boolean;
};

type QuantityCells = number;
type WidthViewBox = number;
type HeightViewBox = number;
type PositionId = number;
type Localhost = string;
type title = string;
type _id = string;
type WidtSvgViewBox = number;
type HeightSvgViewBox = number;
type OriginX = number;
type OriginY = number;
type ActionDoubleClick = any
