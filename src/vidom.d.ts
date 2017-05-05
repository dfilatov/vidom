interface MapLike<T> {
    readonly [key: string]: T
}

type Key = string | number;
type Ref<T> = (instance: T) => void;

declare abstract class VNode {
    readonly key: Key | null;

    setKey(key: Key): this;
    abstract clone(): VNode;
}

declare class TagVNode extends VNode {
    readonly tag: string;
    readonly attrs: HTMLAttributes<Element>;
    readonly ns: string | null;
    readonly children: VNode[] | string | null;

    setAttrs(attrs: HTMLAttributes<Element>): this;
    setNs(ns: string): this;
    setChildren(children: VNode | VNode[] | string): this;
    setHtml(html: string): this;
    setRef(callback: Ref<Element>): this;
    clone(): TagVNode;
}

declare class TextVNode extends VNode {
    readonly children: string;

    setChildren(children: string): this;
    clone(): TextVNode;
}

declare class FragmentVNode extends VNode {
    readonly children: VNode[];

    setChildren(children: VNode | VNode[]): this;
    clone(): FragmentVNode;
}

declare class ComponentVNode<A, C, T, CC> {
    readonly component: CC;
    readonly attrs: Readonly<A>;
    readonly children?: Readonly<C>;

    setAttrs(attrs: A): this;
    setChildren(children: C): this;
    setRef(callback: Ref<T>): this;
    clone(): ComponentVNode<A, C, T, CC>;
}

declare class FunctionComponentVNode<A, C, T> {
    readonly component: T;
    readonly attrs: Readonly<A>;
    readonly children?: Readonly<C>;

    setAttrs(attrs: A): this;
    setChildren(children: C): this;
    clone(): FunctionComponentVNode<A, C, T>;
}

interface ComponentClass<A, C, T> {
    new (attrs: A, children: C): T;
}

interface Attributes {
    key?: Key;
}

interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>;
}

declare class SyntheticEvent<T> {
    type: string;
    target: T;
    nativeEvent: Event;

    stopPropagation(): void;
    isPropagationStopped(): boolean;
    preventDefault(): void;
    isDefaultPrevented: boolean;
    persist(): void;
}

interface DOMEventHandler<T> {
    (event: SyntheticEvent<T>): void;
}

interface DOMAttributes<T> {
    onBlur?: DOMEventHandler<T>;
    onCanPlay?: DOMEventHandler<T>;
    onCanPlayThrough?: DOMEventHandler<T>;
    onChange?: DOMEventHandler<T>;
    onClick?: DOMEventHandler<T>;
    onComplete?: DOMEventHandler<T>;
    onContextMenu?: DOMEventHandler<T>;
    onCopy?: DOMEventHandler<T>;
    onCut?: DOMEventHandler<T>;
    onDblClick?: DOMEventHandler<T>;
    onDrag?: DOMEventHandler<T>;
    onDragEnd?: DOMEventHandler<T>;
    onDragEnter?: DOMEventHandler<T>;
    onDragLeave?: DOMEventHandler<T>;
    onDragOver?: DOMEventHandler<T>;
    onDragStart?: DOMEventHandler<T>;
    onDrop?: DOMEventHandler<T>;
    onDurationChange?: DOMEventHandler<T>;
    onEmptied?: DOMEventHandler<T>;
    onEnded?: DOMEventHandler<T>;
    onError?: DOMEventHandler<T>;
    onFocus?: DOMEventHandler<T>;
    onInput?: DOMEventHandler<T>;
    onKeyDown?: DOMEventHandler<T>;
    onKeyPress?: DOMEventHandler<T>;
    onKeyUp?: DOMEventHandler<T>;
    onLoad?: DOMEventHandler<T>;
    onLoadedData?: DOMEventHandler<T>;
    onLoadedMetadata?: DOMEventHandler<T>;
    onLoadStart?: DOMEventHandler<T>;
    onMouseDown?: DOMEventHandler<T>;
    onMouseEnter?: DOMEventHandler<T>;
    onMouseLeave?: DOMEventHandler<T>;
    onMouseMove?: DOMEventHandler<T>;
    onMouseOut?: DOMEventHandler<T>;
    onMouseOver?: DOMEventHandler<T>;
    onMouseUp?: DOMEventHandler<T>;
    onPaste?: DOMEventHandler<T>;
    onPause?: DOMEventHandler<T>;
    onPlay?: DOMEventHandler<T>;
    onPlaying?: DOMEventHandler<T>;
    onProgress?: DOMEventHandler<T>;
    onRateChange?: DOMEventHandler<T>;
    onScroll?: DOMEventHandler<T>;
    onSeeked?: DOMEventHandler<T>;
    onSeeking?: DOMEventHandler<T>;
    onSelect?: DOMEventHandler<T>;
    onStalled?: DOMEventHandler<T>;
    onSubmit?: DOMEventHandler<T>;
    onSuspend?: DOMEventHandler<T>;
    onTimeUpdate?: DOMEventHandler<T>;
    onTouchCancel?: DOMEventHandler<T>;
    onTouchEnd?: DOMEventHandler<T>;
    onTouchMove?: DOMEventHandler<T>;
    onTouchStart?: DOMEventHandler<T>;
    onVolumeChange?: DOMEventHandler<T>;
    onWaiting?: DOMEventHandler<T>;
    onWheel?: DOMEventHandler<T>;
}

interface HTMLAttributes<T> extends DOMAttributes<T>, ClassAttributes<T> {
    accept?: string;
    acceptCharset?: string;
    accessKey?: string;
    action?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    alt?: string;
    async?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    autoPlay?: boolean;
    capture?: boolean;
    cellPadding?: number | string;
    cellSpacing?: number | string;
    charSet?: string;
    challenge?: string;
    checked?: boolean;
    classID?: string;
    class?: string;
    cols?: number;
    colSpan?: number;
    content?: string;
    contentEditable?: boolean;
    contextMenu?: string;
    controls?: boolean;
    coords?: string;
    crossOrigin?: string;
    data?: string;
    dateTime?: string;
    default?: boolean;
    defer?: boolean;
    dir?: string;
    disabled?: boolean;
    download?: any;
    draggable?: boolean;
    encType?: string;
    for?: string;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    frameBorder?: number | string;
    headers?: string;
    height?: number | string;
    hidden?: boolean;
    high?: number;
    href?: string;
    hrefLang?: string;
    httpEquiv?: string;
    id?: string;
    inputMode?: string;
    integrity?: string;
    is?: string;
    keyParams?: string;
    keyType?: string;
    kind?: string;
    label?: string;
    lang?: string;
    list?: string;
    loop?: boolean;
    low?: number;
    manifest?: string;
    marginHeight?: number;
    marginWidth?: number;
    max?: number | string;
    maxLength?: number;
    media?: string;
    mediaGroup?: string;
    method?: string;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    muted?: boolean;
    name?: string;
    nonce?: string;
    noValidate?: boolean;
    open?: boolean;
    optimum?: number;
    pattern?: string;
    placeholder?: string;
    playsInline?: boolean;
    poster?: string;
    preload?: string;
    radioGroup?: string;
    readOnly?: boolean;
    rel?: string;
    required?: boolean;
    reversed?: boolean;
    role?: string;
    rows?: number;
    rowSpan?: number;
    sandbox?: string;
    scope?: string;
    scoped?: boolean;
    scrolling?: string;
    seamless?: boolean;
    selected?: boolean;
    shape?: string;
    size?: number;
    sizes?: string;
    slot?: string;
    span?: number;
    spellCheck?: boolean;
    src?: string;
    srcDoc?: string;
    srcLang?: string;
    srcSet?: string;
    start?: number;
    step?: number | string;
    style?: MapLike<string | number>;
    summary?: string;
    tabIndex?: number;
    target?: string;
    title?: string;
    type?: string;
    useMap?: string;
    value?: string | string[] | number;
    width?: number | string;
    wmode?: string;
    wrap?: string;

    // Non-standard attributes
    autoCapitalize?: string;
    autoCorrect?: string;
    autoSave?: string;
    color?: string;
    itemProp?: string;
    itemScope?: boolean;
    itemType?: string;
    itemID?: string;
    itemRef?: string;
    results?: number;
    security?: string;
    unselectable?: boolean;
}

interface SVGAttributes<T> extends DOMAttributes<T>, ClassAttributes<T> {
    ns: string;

    class?: string;
    color?: string;
    height?: number | string;
    id?: string;
    lang?: string;
    max?: number | string;
    media?: string;
    method?: string;
    min?: number | string;
    name?: string;
    style?: {};
    target?: string;
    type?: string;
    width?: number | string;

    accentHeight?: number | string;
    accumulate?: 'none' | 'sum';
    additive?: 'replace' | 'sum';
    alignmentBaseline?: 'auto' | 'baseline' | 'before-edge' | 'text-before-edge' | 'middle' | 'central' | 'after-edge' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | 'inherit';
    allowReorder?: 'no' | 'yes';
    alphabetic?: number | string;
    amplitude?: number | string;
    arabicForm?: 'initial' | 'medial' | 'terminal' | 'isolated';
    ascent?: number | string;
    attributeName?: string;
    attributeType?: string;
    autoReverse?: number | string;
    azimuth?: number | string;
    baseFrequency?: number | string;
    baselineShift?: number | string;
    baseProfile?: number | string;
    bbox?: number | string;
    begin?: number | string;
    bias?: number | string;
    by?: number | string;
    calcMode?: number | string;
    capHeight?: number | string;
    clip?: number | string;
    clipPath?: string;
    clipPathUnits?: number | string;
    clipRule?: number | string;
    colorInterpolation?: number | string;
    colorInterpolationFilters?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
    colorProfile?: number | string;
    colorRendering?: number | string;
    contentScriptType?: number | string;
    contentStyleType?: number | string;
    cursor?: number | string;
    cx?: number | string;
    cy?: number | string;
    d?: string;
    decelerate?: number | string;
    descent?: number | string;
    diffuseConstant?: number | string;
    direction?: number | string;
    display?: number | string;
    divisor?: number | string;
    dominantBaseline?: number | string;
    dur?: number | string;
    dx?: number | string;
    dy?: number | string;
    edgeMode?: number | string;
    elevation?: number | string;
    enableBackground?: number | string;
    end?: number | string;
    exponent?: number | string;
    externalResourcesRequired?: number | string;
    fill?: string;
    fillOpacity?: number | string;
    fillRule?: 'nonzero' | 'evenodd' | 'inherit';
    filter?: string;
    filterRes?: number | string;
    filterUnits?: number | string;
    floodColor?: number | string;
    floodOpacity?: number | string;
    focusable?: number | string;
    fontFamily?: string;
    fontSize?: number | string;
    fontSizeAdjust?: number | string;
    fontStretch?: number | string;
    fontStyle?: number | string;
    fontVariant?: number | string;
    fontWeight?: number | string;
    format?: number | string;
    from?: number | string;
    fx?: number | string;
    fy?: number | string;
    g1?: number | string;
    g2?: number | string;
    glyphName?: number | string;
    glyphOrientationHorizontal?: number | string;
    glyphOrientationVertical?: number | string;
    glyphRef?: number | string;
    gradientTransform?: string;
    gradientUnits?: string;
    hanging?: number | string;
    horizAdvX?: number | string;
    horizOriginX?: number | string;
    ideographic?: number | string;
    imageRendering?: number | string;
    in2?: number | string;
    in?: string;
    intercept?: number | string;
    k1?: number | string;
    k2?: number | string;
    k3?: number | string;
    k4?: number | string;
    k?: number | string;
    kernelMatrix?: number | string;
    kernelUnitLength?: number | string;
    kerning?: number | string;
    keyPoints?: number | string;
    keySplines?: number | string;
    keyTimes?: number | string;
    lengthAdjust?: number | string;
    letterSpacing?: number | string;
    lightingColor?: number | string;
    limitingConeAngle?: number | string;
    local?: number | string;
    markerEnd?: string;
    markerHeight?: number | string;
    markerMid?: string;
    markerStart?: string;
    markerUnits?: number | string;
    markerWidth?: number | string;
    mask?: string;
    maskContentUnits?: number | string;
    maskUnits?: number | string;
    mathematical?: number | string;
    mode?: number | string;
    numOctaves?: number | string;
    offset?: number | string;
    opacity?: number | string;
    operator?: number | string;
    order?: number | string;
    orient?: number | string;
    orientation?: number | string;
    origin?: number | string;
    overflow?: number | string;
    overlinePosition?: number | string;
    overlineThickness?: number | string;
    paintOrder?: number | string;
    panose1?: number | string;
    pathLength?: number | string;
    patternContentUnits?: string;
    patternTransform?: number | string;
    patternUnits?: string;
    pointerEvents?: number | string;
    points?: string;
    pointsAtX?: number | string;
    pointsAtY?: number | string;
    pointsAtZ?: number | string;
    preserveAlpha?: number | string;
    preserveAspectRatio?: string;
    primitiveUnits?: number | string;
    r?: number | string;
    radius?: number | string;
    refX?: number | string;
    refY?: number | string;
    renderingIntent?: number | string;
    repeatCount?: number | string;
    repeatDur?: number | string;
    requiredExtensions?: number | string;
    requiredFeatures?: number | string;
    restart?: number | string;
    result?: string;
    rotate?: number | string;
    rx?: number | string;
    ry?: number | string;
    scale?: number | string;
    seed?: number | string;
    shapeRendering?: number | string;
    slope?: number | string;
    spacing?: number | string;
    specularConstant?: number | string;
    specularExponent?: number | string;
    speed?: number | string;
    spreadMethod?: string;
    startOffset?: number | string;
    stdDeviation?: number | string;
    stemh?: number | string;
    stemv?: number | string;
    stitchTiles?: number | string;
    stopColor?: string;
    stopOpacity?: number | string;
    strikethroughPosition?: number | string;
    strikethroughThickness?: number | string;
    string?: number | string;
    stroke?: string;
    strokeDasharray?: string | number;
    strokeDashoffset?: string | number;
    strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit';
    strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit';
    strokeMiterlimit?: string;
    strokeOpacity?: number | string;
    strokeWidth?: number | string;
    surfaceScale?: number | string;
    systemLanguage?: number | string;
    tableValues?: number | string;
    targetX?: number | string;
    targetY?: number | string;
    textAnchor?: string;
    textDecoration?: number | string;
    textLength?: number | string;
    textRendering?: number | string;
    to?: number | string;
    transform?: string;
    u1?: number | string;
    u2?: number | string;
    underlinePosition?: number | string;
    underlineThickness?: number | string;
    unicode?: number | string;
    unicodeBidi?: number | string;
    unicodeRange?: number | string;
    unitsPerEm?: number | string;
    vAlphabetic?: number | string;
    values?: string;
    vectorEffect?: number | string;
    version?: string;
    vertAdvY?: number | string;
    vertOriginX?: number | string;
    vertOriginY?: number | string;
    vHanging?: number | string;
    vIdeographic?: number | string;
    viewBox?: string;
    viewTarget?: number | string;
    visibility?: number | string;
    vMathematical?: number | string;
    widths?: number | string;
    wordSpacing?: number | string;
    writingMode?: number | string;
    x1?: number | string;
    x2?: number | string;
    x?: number | string;
    xChannelSelector?: string;
    xHeight?: number | string;
    xlinkActuate?: string;
    xlinkArcrole?: string;
    xlinkHref?: string;
    xlinkRole?: string;
    xlinkShow?: string;
    xlinkTitle?: string;
    xlinkType?: string;
    xmlBase?: string;
    xmlLang?: string;
    xmlns?: string;
    xmlnsXlink?: string;
    xmlSpace?: string;
    y1?: number | string;
    y2?: number | string;
    y?: number | string;
    yChannelSelector?: string;
    z?: number | string;
    zoomAndPan?: string;
}

declare global {
    namespace JSX {
        interface Element extends VNode {}
        interface ElementClass extends vidom.Component<any, any, any> {}
        interface ElementAttributesProperty { attrs: {}; }
        interface IntrinsicAttributes extends Attributes {}
        interface IntrinsicClassAttributes<T> extends ClassAttributes<T> {}
        interface IntrinsicElements {
            fragment: Attributes;

            a: HTMLAttributes<HTMLAnchorElement>;
            abbr: HTMLAttributes<HTMLElement>;
            address: HTMLAttributes<HTMLElement>;
            area: HTMLAttributes<HTMLAreaElement>;
            article: HTMLAttributes<HTMLElement>;
            aside: HTMLAttributes<HTMLElement>;
            audio: HTMLAttributes<HTMLAudioElement>;
            b: HTMLAttributes<HTMLElement>;
            base: HTMLAttributes<HTMLBaseElement>;
            bdi: HTMLAttributes<HTMLElement>;
            bdo: HTMLAttributes<HTMLElement>;
            big: HTMLAttributes<HTMLElement>;
            blockquote: HTMLAttributes<HTMLElement>;
            body: HTMLAttributes<HTMLBodyElement>;
            br: HTMLAttributes<HTMLBRElement>;
            button: HTMLAttributes<HTMLButtonElement>;
            canvas: HTMLAttributes<HTMLCanvasElement>;
            caption: HTMLAttributes<HTMLElement>;
            cite: HTMLAttributes<HTMLElement>;
            code: HTMLAttributes<HTMLElement>;
            col: HTMLAttributes<HTMLTableColElement>;
            colgroup: HTMLAttributes<HTMLTableColElement>;
            data: HTMLAttributes<HTMLElement>;
            datalist: HTMLAttributes<HTMLDataListElement>;
            dd: HTMLAttributes<HTMLElement>;
            del: HTMLAttributes<HTMLElement>;
            details: HTMLAttributes<HTMLElement>;
            dfn: HTMLAttributes<HTMLElement>;
            dialog: HTMLAttributes<HTMLElement>;
            div: HTMLAttributes<HTMLDivElement>;
            dl: HTMLAttributes<HTMLDListElement>;
            dt: HTMLAttributes<HTMLElement>;
            em: HTMLAttributes<HTMLElement>;
            embed: HTMLAttributes<HTMLEmbedElement>;
            fieldset: HTMLAttributes<HTMLFieldSetElement>;
            figcaption: HTMLAttributes<HTMLElement>;
            figure: HTMLAttributes<HTMLElement>;
            footer: HTMLAttributes<HTMLElement>;
            form: HTMLAttributes<HTMLFormElement>;
            h1: HTMLAttributes<HTMLHeadingElement>;
            h2: HTMLAttributes<HTMLHeadingElement>;
            h3: HTMLAttributes<HTMLHeadingElement>;
            h4: HTMLAttributes<HTMLHeadingElement>;
            h5: HTMLAttributes<HTMLHeadingElement>;
            h6: HTMLAttributes<HTMLHeadingElement>;
            head: HTMLAttributes<HTMLHeadElement>;
            header: HTMLAttributes<HTMLElement>;
            hgroup: HTMLAttributes<HTMLElement>;
            hr: HTMLAttributes<HTMLHRElement>;
            html: HTMLAttributes<HTMLHtmlElement>;
            i: HTMLAttributes<HTMLElement>;
            iframe: HTMLAttributes<HTMLIFrameElement>;
            img: HTMLAttributes<HTMLImageElement>;
            input: HTMLAttributes<HTMLInputElement>;
            ins: HTMLAttributes<HTMLModElement>;
            kbd: HTMLAttributes<HTMLElement>;
            keygen: HTMLAttributes<HTMLElement>;
            label: HTMLAttributes<HTMLLabelElement>;
            legend: HTMLAttributes<HTMLLegendElement>;
            li: HTMLAttributes<HTMLLIElement>;
            link: HTMLAttributes<HTMLLinkElement>;
            main: HTMLAttributes<HTMLElement>;
            map: HTMLAttributes<HTMLMapElement>;
            mark: HTMLAttributes<HTMLElement>;
            menu: HTMLAttributes<HTMLElement>;
            menuitem: HTMLAttributes<HTMLElement>;
            meta: HTMLAttributes<HTMLMetaElement>;
            meter: HTMLAttributes<HTMLElement>;
            nav: HTMLAttributes<HTMLElement>;
            noindex: HTMLAttributes<HTMLElement>;
            noscript: HTMLAttributes<HTMLElement>;
            object: HTMLAttributes<HTMLObjectElement>;
            ol: HTMLAttributes<HTMLOListElement>;
            optgroup: HTMLAttributes<HTMLOptGroupElement>;
            option: HTMLAttributes<HTMLOptionElement>;
            output: HTMLAttributes<HTMLElement>;
            p: HTMLAttributes<HTMLParagraphElement>;
            param: HTMLAttributes<HTMLParamElement>;
            picture: HTMLAttributes<HTMLElement>;
            pre: HTMLAttributes<HTMLPreElement>;
            progress: HTMLAttributes<HTMLProgressElement>;
            q: HTMLAttributes<HTMLQuoteElement>;
            rp: HTMLAttributes<HTMLElement>;
            rt: HTMLAttributes<HTMLElement>;
            ruby: HTMLAttributes<HTMLElement>;
            s: HTMLAttributes<HTMLElement>;
            samp: HTMLAttributes<HTMLElement>;
            script: HTMLAttributes<HTMLElement>;
            section: HTMLAttributes<HTMLElement>;
            select: HTMLAttributes<HTMLSelectElement>;
            small: HTMLAttributes<HTMLElement>;
            source: HTMLAttributes<HTMLSourceElement>;
            span: HTMLAttributes<HTMLSpanElement>;
            strong: HTMLAttributes<HTMLElement>;
            style: HTMLAttributes<HTMLStyleElement>;
            sub: HTMLAttributes<HTMLElement>;
            summary: HTMLAttributes<HTMLElement>;
            sup: HTMLAttributes<HTMLElement>;
            table: HTMLAttributes<HTMLTableElement>;
            tbody: HTMLAttributes<HTMLTableSectionElement>;
            td: HTMLAttributes<HTMLTableDataCellElement>;
            textarea: HTMLAttributes<HTMLTextAreaElement>;
            tfoot: HTMLAttributes<HTMLTableSectionElement>;
            th: HTMLAttributes<HTMLTableHeaderCellElement>;
            thead: HTMLAttributes<HTMLTableSectionElement>;
            time: HTMLAttributes<HTMLElement>;
            title: HTMLAttributes<HTMLTitleElement>;
            tr: HTMLAttributes<HTMLTableRowElement>;
            track: HTMLAttributes<HTMLTrackElement>;
            u: HTMLAttributes<HTMLElement>;
            ul: HTMLAttributes<HTMLUListElement>;
            'var': HTMLAttributes<HTMLElement>;
            video: HTMLAttributes<HTMLVideoElement>;
            wbr: HTMLAttributes<HTMLElement>;

            // SVG
            svg: SVGAttributes<SVGSVGElement>;

            animate: SVGAttributes<SVGElement>;
            circle: SVGAttributes<SVGCircleElement>;
            clipPath: SVGAttributes<SVGClipPathElement>;
            defs: SVGAttributes<SVGDefsElement>;
            desc: SVGAttributes<SVGDescElement>;
            ellipse: SVGAttributes<SVGEllipseElement>;
            feBlend: SVGAttributes<SVGFEBlendElement>;
            feColorMatrix: SVGAttributes<SVGFEColorMatrixElement>;
            feComponentTransfer: SVGAttributes<SVGFEComponentTransferElement>;
            feComposite: SVGAttributes<SVGFECompositeElement>;
            feConvolveMatrix: SVGAttributes<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: SVGAttributes<SVGFEDiffuseLightingElement>;
            feDisplacementMap: SVGAttributes<SVGFEDisplacementMapElement>;
            feDistantLight: SVGAttributes<SVGFEDistantLightElement>;
            feFlood: SVGAttributes<SVGFEFloodElement>;
            feFuncA: SVGAttributes<SVGFEFuncAElement>;
            feFuncB: SVGAttributes<SVGFEFuncBElement>;
            feFuncG: SVGAttributes<SVGFEFuncGElement>;
            feFuncR: SVGAttributes<SVGFEFuncRElement>;
            feGaussianBlur: SVGAttributes<SVGFEGaussianBlurElement>;
            feImage: SVGAttributes<SVGFEImageElement>;
            feMerge: SVGAttributes<SVGFEMergeElement>;
            feMergeNode: SVGAttributes<SVGFEMergeNodeElement>;
            feMorphology: SVGAttributes<SVGFEMorphologyElement>;
            feOffset: SVGAttributes<SVGFEOffsetElement>;
            fePointLight: SVGAttributes<SVGFEPointLightElement>;
            feSpecularLighting: SVGAttributes<SVGFESpecularLightingElement>;
            feSpotLight: SVGAttributes<SVGFESpotLightElement>;
            feTile: SVGAttributes<SVGFETileElement>;
            feTurbulence: SVGAttributes<SVGFETurbulenceElement>;
            filter: SVGAttributes<SVGFilterElement>;
            foreignObject: SVGAttributes<SVGForeignObjectElement>;
            g: SVGAttributes<SVGGElement>;
            image: SVGAttributes<SVGImageElement>;
            line: SVGAttributes<SVGLineElement>;
            linearGradient: SVGAttributes<SVGLinearGradientElement>;
            marker: SVGAttributes<SVGMarkerElement>;
            mask: SVGAttributes<SVGMaskElement>;
            metadata: SVGAttributes<SVGMetadataElement>;
            path: SVGAttributes<SVGPathElement>;
            pattern: SVGAttributes<SVGPatternElement>;
            polygon: SVGAttributes<SVGPolygonElement>;
            polyline: SVGAttributes<SVGPolylineElement>;
            radialGradient: SVGAttributes<SVGRadialGradientElement>;
            rect: SVGAttributes<SVGRectElement>;
            stop: SVGAttributes<SVGStopElement>;
            switch: SVGAttributes<SVGSwitchElement>;
            symbol: SVGAttributes<SVGSymbolElement>;
            text: SVGAttributes<SVGTextElement>;
            textPath: SVGAttributes<SVGTextPathElement>;
            tspan: SVGAttributes<SVGTSpanElement>;
            use: SVGAttributes<SVGUseElement>;
            view: SVGAttributes<SVGViewElement>;
        }
    }
}

interface FunctionComponent<A, C> {
    (attrs: A, children: C, context: MapLike<any>): VNode;
}

declare abstract class Component<A, C, S> {
    protected readonly attrs: Readonly<A>;
    protected readonly children: Readonly<C>;
    protected readonly state: Readonly<S>;
    protected readonly context: MapLike<any>;

    constructor(attrs: A, children: C);
    protected setState(state: Partial<S>): void;
    protected update(callback?: () => void): void;
    protected isMounted(): boolean;

    protected onInit(): void;
    protected onMount(): void;
    protected onAttrsReceive(prevAttrs: A): void;
    protected onChildrenReceive(prevChildren: C): void;
    protected onContextReceive(prevContext: MapLike<any>): void;
    protected onChildContextRequest(): MapLike<any>;
    protected shouldRerender(prevAttrs: A, prevChildren: C, prevState: S, prevContext: MapLike<any>): boolean;
    protected abstract onRender(): VNode | null;
    protected onUpdate(prevAttrs: A, prevChildren: C, prevState: S, prevContext: MapLike<any>): void;
    protected onUnmount(): void;
}

declare function node(tag: 'fragment'): FragmentVNode;
declare function node(tag: 'text'): TextVNode;
declare function node(tag: string): TagVNode;
declare function node<A, C, S, T extends Component<A, C, S>, U extends ComponentClass<A, C, T>>(
    component: U & ComponentClass<A, C, T>
    ): ComponentVNode<A, C, T, U>;
declare function node<A, C, T extends FunctionComponent<A, C>> (
    component: T & FunctionComponent<A, C>
    ): FunctionComponentVNode<A, C, T>;

declare function mount(elem: Element, rootVNode: VNode, callback?: () => void): void;
declare function mountSync(elem: Element, rootVNode: VNode): void;
declare function unmount(elem: Element, callback?: () => void): void;
declare function unmountSync(elem: Element): void;

declare function renderToString(rootVNode: VNode): string;

declare const IS_DEBUG: boolean;

export { node, Component, mount, mountSync, unmount, unmountSync, renderToString, IS_DEBUG };

export default { node, Component, mount, mountSync, unmount, unmountSync, renderToString, IS_DEBUG };
