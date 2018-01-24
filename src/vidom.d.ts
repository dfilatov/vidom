// TypeScript Version: 2.6

export = vidom;
export as namespace vidom;

type MapLike<T = any> = Record<string, any>;

type DOMElement = Element;

declare namespace vidom {
    type Key = string | number;
    type Ref<T> = (ref: T | null) => void;

    abstract class BaseElement {
        readonly key: Key | null;

        clone(): this;
    }

    class TagElement extends BaseElement {
        readonly tag: string;
        readonly attrs: HTMLAttributes | SVGAttributes;
        readonly children: Element[] | string | null;
        readonly ref: Ref<DOMElement> | null;

        constructor(
            tag: string,
            key?: Key | null,
            attrs?: HTMLAttributes | SVGAttributes | null,
            children?: Node,
            ref?: Ref<DOMElement> | null,
            escapeChildren?: boolean
        );

        clone(
            attrs?: HTMLAttributes | SVGAttributes | null,
            children?: Node,
            ref?: Ref<DOMElement> | null
        ): this;
    }

    class TextElement extends BaseElement {
        readonly children: string;

        constructor(
            key?: Key | null,
            children?: string
        );

        clone(children?: string): this;
    }

    class FragmentElement extends BaseElement {
        readonly children: Element[] | null;

        constructor(
            key?: Key | null,
            children?: Node
        );

        clone(children?: Node): this;
    }

    class ComponentElement<
        TAttrs extends MapLike = MapLike,
        TChildren = any,
        TComponent extends Component<TAttrs, {}, TChildren> = Component<TAttrs, {}, TChildren>,
        TComponentClass extends ComponentClass<TAttrs, TChildren> = ComponentClass<TAttrs, TChildren>
    > extends BaseElement {
        readonly component: TComponentClass;
        readonly attrs: Readonly<TAttrs>;
        readonly children?: TChildren;
        readonly ref: Ref<TComponent> | null;

        constructor(
            component: TComponentClass,
            key?: Key | null,
            attrs?: TAttrs,
            children?: TChildren,
            ref?: Ref<TComponent> | null
        );

        clone(
            attrs?: TAttrs | null,
            children?: Node,
            ref?: Ref<TComponent> | null
        ): this;
    }

    class FunctionComponentElement<
        TAttrs extends MapLike = MapLike,
        TChildren = any,
        TFunctionComponent extends FunctionComponent<TAttrs, TChildren> = FunctionComponent<TAttrs, TChildren>
    > extends BaseElement {
        readonly component: TFunctionComponent;
        readonly attrs: Readonly<TAttrs>;
        readonly children?: TChildren;

        constructor(
            component: TFunctionComponent,
            key?: Key | null,
            attrs?: TAttrs,
            children?: TChildren
        );

        clone(
            attrs?: TAttrs | null,
            children?: Node
        ): this;
    }

    type Element =
        TagElement |
        TextElement |
        FragmentElement |
        ComponentElement |
        FunctionComponentElement;

    type Node = Element | string | number | boolean | null | undefined | NodeArray;
    interface NodeArray extends Array<Node> {}

    interface WithKey {
        key?: Key | null;
    }

    interface WithRef<T> {
        ref?: Ref<T> | null;
    }

    class SyntheticEvent<TTarget extends DOMElement = DOMElement, TNativeEvent extends Event = Event> {
        readonly type: string;
        readonly target: TTarget;
        readonly nativeEvent: TNativeEvent;

        stopPropagation(): void;
        isPropagationStopped(): boolean;
        preventDefault(): void;
        isDefaultPrevented(): boolean;
        persist(): void;
    }

    type MouseSyntheticEvent<TTarget extends DOMElement = DOMElement> = SyntheticEvent<TTarget, MouseEvent>;
    type KeyboardSyntheticEvent<TTarget extends DOMElement = DOMElement> = SyntheticEvent<TTarget, KeyboardEvent>;
    type DragSyntheticEvent<TTarget extends DOMElement = DOMElement> = SyntheticEvent<TTarget, DragEvent>;
    type TouchSyntheticEvent<TTarget extends DOMElement = DOMElement> = SyntheticEvent<TTarget, TouchEvent>;
    type FocusSyntheticEvent<TTarget extends DOMElement = DOMElement> = SyntheticEvent<TTarget, FocusEvent>;
    type WheelSyntheticEvent<TTarget extends DOMElement = DOMElement> = SyntheticEvent<TTarget, WheelEvent>;

    interface DOMEventHandler<TSyntheticEvent extends SyntheticEvent = SyntheticEvent> {
        (event: TSyntheticEvent): void;
    }

    interface DOMAttributes<TDOMElement extends DOMElement = DOMElement> {
        onAnimationEnd?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onAnimationIteration?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onAnimationStart?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onBlur?: DOMEventHandler<FocusSyntheticEvent<TDOMElement>>;
        onCanPlay?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onCanPlayThrough?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onChange?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onClick?: DOMEventHandler<MouseSyntheticEvent<TDOMElement>>;
        onComplete?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onContextMenu?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onCopy?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onCut?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onDblClick?: DOMEventHandler<MouseSyntheticEvent<TDOMElement>>;
        onDrag?: DOMEventHandler<DragSyntheticEvent<TDOMElement>>;
        onDragEnd?: DOMEventHandler<DragSyntheticEvent<TDOMElement>>;
        onDragEnter?: DOMEventHandler<DragSyntheticEvent<TDOMElement>>;
        onDragLeave?: DOMEventHandler<DragSyntheticEvent<TDOMElement>>;
        onDragOver?: DOMEventHandler<DragSyntheticEvent<TDOMElement>>;
        onDragStart?: DOMEventHandler<DragSyntheticEvent<TDOMElement>>;
        onDrop?: DOMEventHandler<DragSyntheticEvent<TDOMElement>>;
        onDurationChange?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onEmptied?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onEnded?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onError?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onFocus?: DOMEventHandler<FocusSyntheticEvent<TDOMElement>>;
        onInput?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onKeyDown?: DOMEventHandler<KeyboardSyntheticEvent<TDOMElement>>;
        onKeyPress?: DOMEventHandler<KeyboardSyntheticEvent<TDOMElement>>;
        onKeyUp?: DOMEventHandler<KeyboardSyntheticEvent<TDOMElement>>;
        onLoad?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onLoadedData?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onLoadedMetadata?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onLoadStart?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onMouseDown?: DOMEventHandler<MouseSyntheticEvent<TDOMElement>>;
        onMouseEnter?: DOMEventHandler<MouseSyntheticEvent<TDOMElement>>;
        onMouseLeave?: DOMEventHandler<MouseSyntheticEvent<TDOMElement>>;
        onMouseMove?: DOMEventHandler<MouseSyntheticEvent<TDOMElement>>;
        onMouseOut?: DOMEventHandler<MouseSyntheticEvent<TDOMElement>>;
        onMouseOver?: DOMEventHandler<MouseSyntheticEvent<TDOMElement>>;
        onMouseUp?: DOMEventHandler<MouseSyntheticEvent<TDOMElement>>;
        onPaste?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onPause?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onPlay?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onPlaying?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onProgress?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onRateChange?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onScroll?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onSeeked?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onSeeking?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onSelect?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onStalled?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onSubmit?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onSuspend?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onTimeUpdate?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onTouchCancel?: DOMEventHandler<TouchSyntheticEvent<TDOMElement>>;
        onTouchEnd?: DOMEventHandler<TouchSyntheticEvent<TDOMElement>>;
        onTouchMove?: DOMEventHandler<TouchSyntheticEvent<TDOMElement>>;
        onTouchStart?: DOMEventHandler<TouchSyntheticEvent<TDOMElement>>;
        onTransitionEnd?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onVolumeChange?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onWaiting?: DOMEventHandler<SyntheticEvent<TDOMElement>>;
        onWheel?: DOMEventHandler<WheelSyntheticEvent<TDOMElement>>;
    }

    interface HTMLAttributes<THTMLElement extends HTMLElement = HTMLElement> extends DOMAttributes<THTMLElement> {
        accept?: string;
        acceptCharset?: string;
        accessKey?: string;
        action?: string;
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        alt?: string;
        'aria-checked'?: string,
        'aria-disabled'?: boolean,
        'aria-hidden'?: boolean,
        'aria-pressed'?: string,
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
        html?: string,
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
        style?: MapLike<string | number | null>;
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

    interface SVGAttributes<TSVGElement extends SVGElement = SVGElement> extends DOMAttributes<TSVGElement> {
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
        alignmentBaseline?:
            'auto' | 'baseline' | 'before-edge' | 'text-before-edge' | 'middle' | 'central' | 'after-edge' |
            'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | 'inherit';
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

    interface ComponentClass<
        TAttrs extends MapLike = {},
        TChildren = any,
        TContext extends MapLike = {},
        TComponent = Component<TAttrs, {}, TChildren, TContext>
    > {
        new (attrs: TAttrs, children: TChildren, context: TContext): TComponent;
        defaultAttrs?: Partial<TAttrs>;
    }

    interface FunctionComponent<
        TAttrs extends MapLike = {},
        TChildren = any,
        TContext extends MapLike = {}
    > {
         (attrs: TAttrs, children: TChildren, context: TContext): Element | null;
         defaultAttrs?: Partial<TAttrs>;
    }

    type ComponentType<
        TAttrs extends MapLike = {},
        TChildren = any,
        TContext extends MapLike = {}
    > =
        ComponentClass<TAttrs, TChildren, TContext> |
        FunctionComponent<TAttrs, TChildren, TContext>;

    abstract class Component<
        TAttrs extends MapLike = {},
        TState extends MapLike = {},
        TChildren = any,
        TContext extends MapLike = {},
        TChildContext extends MapLike = {}
    > {
        protected readonly attrs: Readonly<TAttrs>;
        protected readonly children: TChildren;
        protected readonly state: Readonly<TState>;
        protected readonly context: Readonly<TContext>;

        constructor(attrs: TAttrs, children: TChildren);
        protected setState(state: Partial<TState>): void;
        protected update(): void;
        protected isMounted(): boolean;
        protected getDomNode(): DOMElement | DOMElement[];

        protected onInit(): void;
        protected onMount(): void;
        protected onAttrsReceive(nextAttrs: TAttrs): void;
        protected onChildrenReceive(nextChildren: TChildren): void;
        protected onContextReceive(nextContext: TContext): void;
        protected onChildContextRequest(): TChildContext;
        protected shouldUpdate(
            nextAttrs: TAttrs,
            nextChildren: TChildren,
            nextState: TState,
            nextContext: TContext
        ): boolean;
        protected abstract onRender(): Node;
        protected onUpdate(
            prevAttrs: TAttrs,
            prevChildren: TChildren,
            prevState: TState,
            prevContext: TContext
        ): void;
        protected onUnmount(): void;
    }

    function elem(
        tag: 'fragment',
        key?: Key | null,
        children?: Node
    ): FragmentElement;
    function elem(
        tag: 'plaintext',
        key?: Key | null,
        children?: string
    ): TextElement;
    function elem(
        tag: string,
        key?: Key | null,
        attrs?: HTMLAttributes | SVGAttributes | null,
        children?: Node,
        ref?: Ref<Element> | null,
        escapeChildren?: boolean
    ): TagElement;
    function elem<
        TAttrs,
        TChildren,
        TComponent extends Component<TAttrs, {}, TChildren>,
        TComponentClass extends ComponentClass<TAttrs, TChildren, TComponent>
    >(
        component: TComponentClass & ComponentClass<TAttrs, TChildren, TComponent>,
        key?: Key | null,
        attrs?: TAttrs,
        children?: TChildren,
        ref?: Ref<TComponent> | null
    ): ComponentElement<TAttrs, TChildren, TComponent, TComponentClass>;
    function elem<TAttrs, TChildren, TFunctionComponent extends FunctionComponent<TAttrs, TChildren>> (
        component: TFunctionComponent & FunctionComponent<TAttrs, TChildren>,
        key?: Key | null,
        attrs?: TAttrs,
        children?: TChildren
    ): FunctionComponentElement<TAttrs, TChildren, TFunctionComponent>;

    function mount(domElem: DOMElement, node: Node, callback?: () => void): void;
    function mount(domElem: DOMElement, node: Node, context?: MapLike, callback?: () => void): void;
    function mountSync(domElem: DOMElement, node: Node, context?: MapLike): void;
    function unmount(domElem: DOMElement, callback?: () => void): void;
    function unmountSync(domElem: DOMElement): void;

    function renderToString(node: Node): string;

    const IS_DEBUG: boolean;
}

declare global {
    namespace JSX {
        type Element = vidom.Element;
        type ElementClass = vidom.Component;
        type ElementAttributesProperty = { attrs: {}; };

        interface IntrinsicAttributes extends vidom.WithKey {}
        interface IntrinsicClassAttributes extends vidom.WithKey, vidom.WithRef<vidom.Component> {}
        interface IntrinsicHMTLAttributes<THTMLElement extends HTMLElement = HTMLElement>
            extends vidom.HTMLAttributes<THTMLElement>, vidom.WithRef<THTMLElement>, vidom.WithKey {}
        interface IntrinsicSVGAttributes<TSVGElement extends SVGElement>
            extends vidom.SVGAttributes<TSVGElement>, vidom.WithRef<TSVGElement>, vidom.WithKey {}

        interface IntrinsicElements {
            fragment: vidom.WithKey;
            plaintext: vidom.WithKey;

            a: IntrinsicHMTLAttributes<HTMLAnchorElement>;
            abbr: IntrinsicHMTLAttributes;
            address: IntrinsicHMTLAttributes;
            area: IntrinsicHMTLAttributes<HTMLAreaElement>;
            article: IntrinsicHMTLAttributes;
            aside: IntrinsicHMTLAttributes;
            audio: IntrinsicHMTLAttributes<HTMLAudioElement>;
            b: IntrinsicHMTLAttributes;
            base: IntrinsicHMTLAttributes<HTMLBaseElement>;
            bdi: IntrinsicHMTLAttributes;
            bdo: IntrinsicHMTLAttributes;
            big: IntrinsicHMTLAttributes;
            blockquote: IntrinsicHMTLAttributes;
            body: IntrinsicHMTLAttributes<HTMLBodyElement>;
            br: IntrinsicHMTLAttributes<HTMLBRElement>;
            button: IntrinsicHMTLAttributes<HTMLButtonElement>;
            canvas: IntrinsicHMTLAttributes<HTMLCanvasElement>;
            caption: IntrinsicHMTLAttributes;
            cite: IntrinsicHMTLAttributes;
            code: IntrinsicHMTLAttributes;
            col: IntrinsicHMTLAttributes<HTMLTableColElement>;
            colgroup: IntrinsicHMTLAttributes<HTMLTableColElement>;
            data: IntrinsicHMTLAttributes;
            datalist: IntrinsicHMTLAttributes<HTMLDataListElement>;
            dd: IntrinsicHMTLAttributes;
            del: IntrinsicHMTLAttributes;
            details: IntrinsicHMTLAttributes;
            dfn: IntrinsicHMTLAttributes;
            dialog: IntrinsicHMTLAttributes;
            div: IntrinsicHMTLAttributes<HTMLDivElement>;
            dl: IntrinsicHMTLAttributes<HTMLDListElement>;
            dt: IntrinsicHMTLAttributes;
            em: IntrinsicHMTLAttributes;
            embed: IntrinsicHMTLAttributes<HTMLEmbedElement>;
            fieldset: IntrinsicHMTLAttributes<HTMLFieldSetElement>;
            figcaption: IntrinsicHMTLAttributes;
            figure: IntrinsicHMTLAttributes;
            footer: IntrinsicHMTLAttributes;
            form: IntrinsicHMTLAttributes<HTMLFormElement>;
            h1: IntrinsicHMTLAttributes<HTMLHeadingElement>;
            h2: IntrinsicHMTLAttributes<HTMLHeadingElement>;
            h3: IntrinsicHMTLAttributes<HTMLHeadingElement>;
            h4: IntrinsicHMTLAttributes<HTMLHeadingElement>;
            h5: IntrinsicHMTLAttributes<HTMLHeadingElement>;
            h6: IntrinsicHMTLAttributes<HTMLHeadingElement>;
            head: IntrinsicHMTLAttributes<HTMLHeadElement>;
            header: IntrinsicHMTLAttributes;
            hgroup: IntrinsicHMTLAttributes;
            hr: IntrinsicHMTLAttributes<HTMLHRElement>;
            html: IntrinsicHMTLAttributes<HTMLHtmlElement>;
            i: IntrinsicHMTLAttributes;
            iframe: IntrinsicHMTLAttributes<HTMLIFrameElement>;
            img: IntrinsicHMTLAttributes<HTMLImageElement>;
            input: IntrinsicHMTLAttributes<HTMLInputElement>;
            ins: IntrinsicHMTLAttributes<HTMLModElement>;
            kbd: IntrinsicHMTLAttributes;
            keygen: IntrinsicHMTLAttributes;
            label: IntrinsicHMTLAttributes<HTMLLabelElement>;
            legend: IntrinsicHMTLAttributes<HTMLLegendElement>;
            li: IntrinsicHMTLAttributes<HTMLLIElement>;
            link: IntrinsicHMTLAttributes<HTMLLinkElement>;
            main: IntrinsicHMTLAttributes;
            map: IntrinsicHMTLAttributes<HTMLMapElement>;
            mark: IntrinsicHMTLAttributes;
            menu: IntrinsicHMTLAttributes;
            menuitem: IntrinsicHMTLAttributes;
            meta: IntrinsicHMTLAttributes<HTMLMetaElement>;
            meter: IntrinsicHMTLAttributes;
            nav: IntrinsicHMTLAttributes;
            noindex: IntrinsicHMTLAttributes;
            noscript: IntrinsicHMTLAttributes;
            object: IntrinsicHMTLAttributes<HTMLObjectElement>;
            ol: IntrinsicHMTLAttributes<HTMLOListElement>;
            optgroup: IntrinsicHMTLAttributes<HTMLOptGroupElement>;
            option: IntrinsicHMTLAttributes<HTMLOptionElement>;
            output: IntrinsicHMTLAttributes;
            p: IntrinsicHMTLAttributes<HTMLParagraphElement>;
            param: IntrinsicHMTLAttributes<HTMLParamElement>;
            picture: IntrinsicHMTLAttributes;
            pre: IntrinsicHMTLAttributes<HTMLPreElement>;
            progress: IntrinsicHMTLAttributes<HTMLProgressElement>;
            q: IntrinsicHMTLAttributes<HTMLQuoteElement>;
            rp: IntrinsicHMTLAttributes;
            rt: IntrinsicHMTLAttributes;
            ruby: IntrinsicHMTLAttributes;
            s: IntrinsicHMTLAttributes;
            samp: IntrinsicHMTLAttributes;
            script: IntrinsicHMTLAttributes;
            section: IntrinsicHMTLAttributes;
            select: IntrinsicHMTLAttributes<HTMLSelectElement>;
            small: IntrinsicHMTLAttributes;
            source: IntrinsicHMTLAttributes<HTMLSourceElement>;
            span: IntrinsicHMTLAttributes<HTMLSpanElement>;
            strong: IntrinsicHMTLAttributes;
            style: IntrinsicHMTLAttributes<HTMLStyleElement>;
            sub: IntrinsicHMTLAttributes;
            summary: IntrinsicHMTLAttributes;
            sup: IntrinsicHMTLAttributes;
            table: IntrinsicHMTLAttributes<HTMLTableElement>;
            tbody: IntrinsicHMTLAttributes<HTMLTableSectionElement>;
            td: IntrinsicHMTLAttributes<HTMLTableDataCellElement>;
            textarea: IntrinsicHMTLAttributes<HTMLTextAreaElement>;
            tfoot: IntrinsicHMTLAttributes<HTMLTableSectionElement>;
            th: IntrinsicHMTLAttributes<HTMLTableHeaderCellElement>;
            thead: IntrinsicHMTLAttributes<HTMLTableSectionElement>;
            time: IntrinsicHMTLAttributes;
            title: IntrinsicHMTLAttributes<HTMLTitleElement>;
            tr: IntrinsicHMTLAttributes<HTMLTableRowElement>;
            track: IntrinsicHMTLAttributes<HTMLTrackElement>;
            u: IntrinsicHMTLAttributes;
            ul: IntrinsicHMTLAttributes<HTMLUListElement>;
            'var': IntrinsicHMTLAttributes;
            video: IntrinsicHMTLAttributes<HTMLVideoElement>;
            wbr: IntrinsicHMTLAttributes;

            // SVG
            svg: IntrinsicSVGAttributes<SVGSVGElement> & { ns: string; };

            animate: IntrinsicSVGAttributes<SVGElement>;
            circle: IntrinsicSVGAttributes<SVGCircleElement>;
            clipPath: IntrinsicSVGAttributes<SVGClipPathElement>;
            defs: IntrinsicSVGAttributes<SVGDefsElement>;
            desc: IntrinsicSVGAttributes<SVGDescElement>;
            ellipse: IntrinsicSVGAttributes<SVGEllipseElement>;
            feBlend: IntrinsicSVGAttributes<SVGFEBlendElement>;
            feColorMatrix: IntrinsicSVGAttributes<SVGFEColorMatrixElement>;
            feComponentTransfer: IntrinsicSVGAttributes<SVGFEComponentTransferElement>;
            feComposite: IntrinsicSVGAttributes<SVGFECompositeElement>;
            feConvolveMatrix: IntrinsicSVGAttributes<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: IntrinsicSVGAttributes<SVGFEDiffuseLightingElement>;
            feDisplacementMap: IntrinsicSVGAttributes<SVGFEDisplacementMapElement>;
            feDistantLight: IntrinsicSVGAttributes<SVGFEDistantLightElement>;
            feFlood: IntrinsicSVGAttributes<SVGFEFloodElement>;
            feFuncA: IntrinsicSVGAttributes<SVGFEFuncAElement>;
            feFuncB: IntrinsicSVGAttributes<SVGFEFuncBElement>;
            feFuncG: IntrinsicSVGAttributes<SVGFEFuncGElement>;
            feFuncR: IntrinsicSVGAttributes<SVGFEFuncRElement>;
            feGaussianBlur: IntrinsicSVGAttributes<SVGFEGaussianBlurElement>;
            feImage: IntrinsicSVGAttributes<SVGFEImageElement>;
            feMerge: IntrinsicSVGAttributes<SVGFEMergeElement>;
            feMergeNode: IntrinsicSVGAttributes<SVGFEMergeNodeElement>;
            feMorphology: IntrinsicSVGAttributes<SVGFEMorphologyElement>;
            feOffset: IntrinsicSVGAttributes<SVGFEOffsetElement>;
            fePointLight: IntrinsicSVGAttributes<SVGFEPointLightElement>;
            feSpecularLighting: IntrinsicSVGAttributes<SVGFESpecularLightingElement>;
            feSpotLight: IntrinsicSVGAttributes<SVGFESpotLightElement>;
            feTile: IntrinsicSVGAttributes<SVGFETileElement>;
            feTurbulence: IntrinsicSVGAttributes<SVGFETurbulenceElement>;
            filter: IntrinsicSVGAttributes<SVGFilterElement>;
            foreignObject: IntrinsicSVGAttributes<SVGForeignObjectElement>;
            g: IntrinsicSVGAttributes<SVGGElement>;
            image: IntrinsicSVGAttributes<SVGImageElement>;
            line: IntrinsicSVGAttributes<SVGLineElement>;
            linearGradient: IntrinsicSVGAttributes<SVGLinearGradientElement>;
            marker: IntrinsicSVGAttributes<SVGMarkerElement>;
            mask: IntrinsicSVGAttributes<SVGMaskElement>;
            metadata: IntrinsicSVGAttributes<SVGMetadataElement>;
            path: IntrinsicSVGAttributes<SVGPathElement>;
            pattern: IntrinsicSVGAttributes<SVGPatternElement>;
            polygon: IntrinsicSVGAttributes<SVGPolygonElement>;
            polyline: IntrinsicSVGAttributes<SVGPolylineElement>;
            radialGradient: IntrinsicSVGAttributes<SVGRadialGradientElement>;
            rect: IntrinsicSVGAttributes<SVGRectElement>;
            stop: IntrinsicSVGAttributes<SVGStopElement>;
            switch: IntrinsicSVGAttributes<SVGSwitchElement>;
            symbol: IntrinsicSVGAttributes<SVGSymbolElement>;
            text: IntrinsicSVGAttributes<SVGTextElement>;
            textPath: IntrinsicSVGAttributes<SVGTextPathElement>;
            tspan: IntrinsicSVGAttributes<SVGTSpanElement>;
            use: IntrinsicSVGAttributes<SVGUseElement>;
            view: IntrinsicSVGAttributes<SVGViewElement>;
        }
    }
}
