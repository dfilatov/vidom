// TypeScript Version: 2.3

export = vidom;
export as namespace vidom;

interface MapLike<T> {
    readonly [key: string]: T
}

declare namespace vidom {
    type Key = string | number;
    type Ref<T> = (instance: T | null) => void;
    type Attrs = {};

    abstract class BaseVNode {
        readonly key: Key | null;

        setKey(key: Key): this;
        abstract clone(): BaseVNode;
    }

    class TagVNode extends BaseVNode {
        readonly tag: string;
        readonly attrs: vidom.HTMLAttributes<Element>;
        readonly ns: string | null;
        readonly children: VNode[] | string | null;

        setAttrs(attrs: vidom.HTMLAttributes<Element>): this;
        setNs(ns: string): this;
        setChildren(children: VNode | VNode[] | string): this;
        setHtml(html: string): this;
        setRef(callback: Ref<Element>): this;
        clone(): TagVNode;
    }

    class TextVNode extends BaseVNode {
        readonly children: string;

        setChildren(children: string): this;
        clone(): TextVNode;
    }

    class FragmentVNode extends BaseVNode {
        readonly children: VNode[] | null;

        setChildren(children: VNode | VNode[]): this;
        clone(): FragmentVNode;
    }

    class ComponentVNode<
        VNodeAttrs extends Attrs = Attrs,
        VNodeChildren = any,
        VNodeComponent extends Component = Component,
        VNodeComponentClass extends ComponentClass = ComponentClass
    > extends BaseVNode {
        readonly component: VNodeComponentClass;
        readonly attrs: Readonly<VNodeAttrs>;
        readonly children?: VNodeChildren;

        setAttrs(attrs: VNodeAttrs): this;
        setChildren(children: VNodeChildren): this;
        setRef(callback: Ref<VNodeComponent>): this;
        clone(): ComponentVNode<VNodeAttrs, VNodeChildren, VNodeComponent, VNodeComponentClass>;
    }

    class FunctionComponentVNode<
        VNodeAttrs extends Attrs = Attrs,
        VNodeChildren = any,
        VNodeFunctionComponent extends FunctionComponent = FunctionComponent
    > extends BaseVNode {
        readonly component: VNodeFunctionComponent;
        readonly attrs: Readonly<VNodeAttrs>;
        readonly children?: VNodeChildren;

        setAttrs(attrs: VNodeAttrs): this;
        setChildren(children: VNodeChildren): this;
        clone(): FunctionComponentVNode<VNodeAttrs, VNodeChildren, VNodeFunctionComponent>;
    }

    type VNode =
        TagVNode |
        TextVNode |
        FragmentVNode |
        ComponentVNode |
        FunctionComponentVNode;

    interface Attributes {
        key?: Key;
    }

    interface ClassAttributes<T> extends Attributes {
        ref?: Ref<T>;
    }

    class SyntheticEvent<T = HTMLElement, NativeEvent = Event> {
        type: string;
        target: T;
        nativeEvent: NativeEvent;

        stopPropagation(): void;
        isPropagationStopped(): boolean;
        preventDefault(): void;
        isDefaultPrevented(): boolean;
        persist(): void;
    }

    type MouseSyntheticEvent<T = HTMLElement> = SyntheticEvent<T, MouseEvent>;
    type KeyboardSyntheticEvent<T = HTMLElement> = SyntheticEvent<T, KeyboardEvent>;
    type DragSyntheticEvent<T = HTMLElement> = SyntheticEvent<T, DragEvent>;
    type TouchSyntheticEvent<T = HTMLElement> = SyntheticEvent<T, TouchEvent>;
    type FocusSyntheticEvent<T = HTMLElement> = SyntheticEvent<T, FocusEvent>;

    interface DOMEventHandler<T = SyntheticEvent> {
        (event: T): void;
    }

    interface DOMAttributes<T = HTMLElement> {
        onAnimationEnd?: DOMEventHandler<SyntheticEvent<T>>;
        onAnimationIteration?: DOMEventHandler<SyntheticEvent<T>>;
        onAnimationStart?: DOMEventHandler<SyntheticEvent<T>>;
        onBlur?: DOMEventHandler<SyntheticEvent<T>>;
        onCanPlay?: DOMEventHandler<SyntheticEvent<T>>;
        onCanPlayThrough?: DOMEventHandler<SyntheticEvent<T>>;
        onChange?: DOMEventHandler<SyntheticEvent<T>>;
        onClick?: DOMEventHandler<MouseSyntheticEvent<T>>;
        onComplete?: DOMEventHandler<SyntheticEvent<T>>;
        onContextMenu?: DOMEventHandler<SyntheticEvent<T>>;
        onCopy?: DOMEventHandler<SyntheticEvent<T>>;
        onCut?: DOMEventHandler<SyntheticEvent<T>>;
        onDblClick?: DOMEventHandler<MouseSyntheticEvent<T>>;
        onDrag?: DOMEventHandler<DragSyntheticEvent<T>>;
        onDragEnd?: DOMEventHandler<DragSyntheticEvent<T>>;
        onDragEnter?: DOMEventHandler<DragSyntheticEvent<T>>;
        onDragLeave?: DOMEventHandler<DragSyntheticEvent<T>>;
        onDragOver?: DOMEventHandler<DragSyntheticEvent<T>>;
        onDragStart?: DOMEventHandler<DragSyntheticEvent<T>>;
        onDrop?: DOMEventHandler<DragSyntheticEvent<T>>;
        onDurationChange?: DOMEventHandler<SyntheticEvent<T>>;
        onEmptied?: DOMEventHandler<SyntheticEvent<T>>;
        onEnded?: DOMEventHandler<SyntheticEvent<T>>;
        onError?: DOMEventHandler<SyntheticEvent<T>>;
        onFocus?: DOMEventHandler<SyntheticEvent<T>>;
        onInput?: DOMEventHandler<SyntheticEvent<T>>;
        onKeyDown?: DOMEventHandler<KeyboardSyntheticEvent<T>>;
        onKeyPress?: DOMEventHandler<KeyboardSyntheticEvent<T>>;
        onKeyUp?: DOMEventHandler<KeyboardSyntheticEvent<T>>;
        onLoad?: DOMEventHandler<SyntheticEvent<T>>;
        onLoadedData?: DOMEventHandler<SyntheticEvent<T>>;
        onLoadedMetadata?: DOMEventHandler<SyntheticEvent<T>>;
        onLoadStart?: DOMEventHandler<SyntheticEvent<T>>;
        onMouseDown?: DOMEventHandler<MouseSyntheticEvent<T>>;
        onMouseEnter?: DOMEventHandler<MouseSyntheticEvent<T>>;
        onMouseLeave?: DOMEventHandler<MouseSyntheticEvent<T>>;
        onMouseMove?: DOMEventHandler<MouseSyntheticEvent<T>>;
        onMouseOut?: DOMEventHandler<MouseSyntheticEvent<T>>;
        onMouseOver?: DOMEventHandler<MouseSyntheticEvent<T>>;
        onMouseUp?: DOMEventHandler<MouseSyntheticEvent<T>>;
        onPaste?: DOMEventHandler<SyntheticEvent<T>>;
        onPause?: DOMEventHandler<SyntheticEvent<T>>;
        onPlay?: DOMEventHandler<SyntheticEvent<T>>;
        onPlaying?: DOMEventHandler<SyntheticEvent<T>>;
        onProgress?: DOMEventHandler<SyntheticEvent<T>>;
        onRateChange?: DOMEventHandler<SyntheticEvent<T>>;
        onScroll?: DOMEventHandler<SyntheticEvent<T>>;
        onSeeked?: DOMEventHandler<SyntheticEvent<T>>;
        onSeeking?: DOMEventHandler<SyntheticEvent<T>>;
        onSelect?: DOMEventHandler<SyntheticEvent<T>>;
        onStalled?: DOMEventHandler<SyntheticEvent<T>>;
        onSubmit?: DOMEventHandler<SyntheticEvent<T>>;
        onSuspend?: DOMEventHandler<SyntheticEvent<T>>;
        onTimeUpdate?: DOMEventHandler<SyntheticEvent<T>>;
        onTouchCancel?: DOMEventHandler<TouchSyntheticEvent<T>>;
        onTouchEnd?: DOMEventHandler<TouchSyntheticEvent<T>>;
        onTouchMove?: DOMEventHandler<TouchSyntheticEvent<T>>;
        onTouchStart?: DOMEventHandler<TouchSyntheticEvent<T>>;
        onTransitionEnd?: DOMEventHandler<SyntheticEvent<T>>;
        onVolumeChange?: DOMEventHandler<SyntheticEvent<T>>;
        onWaiting?: DOMEventHandler<SyntheticEvent<T>>;
        onWheel?: DOMEventHandler<SyntheticEvent<T>>;
    }

    interface HTMLAttributes<T = HTMLElement> extends DOMAttributes<T>, ClassAttributes<T> {
        accept?: string;
        acceptCharset?: string;
        accessKey?: string;
        action?: string;
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        alt?: string;
        'aria-checked'?: string,
        'aria-disabled'?: boolean,
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

    interface SVGAttributes<T> extends DOMAttributes<T>, ClassAttributes<T> {
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

    interface ComponentClass<ComponentClassAttrs extends Attrs = Attrs, Children = any, T = Component> {
        new (attrs: ComponentClassAttrs, children: Children): T;
        defaultAttrs?: Partial<ComponentClassAttrs>;
    }

    interface FunctionComponent<Attrs = {}, Children = any, Context = {}> {
         (attrs: Attrs, children: Children, context: Context): VNode;
    }

    abstract class Component<
        ComponentAttrs extends Attrs = Attrs,
        ComponentState extends {} = {},
        ComponentChildren = any,
        ComponentContext extends {} = {}
    > {
        protected readonly attrs: Readonly<ComponentAttrs>;
        protected readonly children: ComponentChildren;
        protected readonly state: Readonly<ComponentState>;
        protected readonly context: Readonly<ComponentContext>;

        constructor(attrs: ComponentAttrs, children: ComponentChildren);
        protected setState(state: Partial<ComponentState>): void;
        protected update(callback?: () => void): void;
        protected isMounted(): boolean;
        protected getDomNode(): Element | Element[];

        protected onInit(): void;
        protected onMount(): void;
        protected onAttrsReceive(prevAttrs: ComponentAttrs): void;
        protected onChildrenReceive(prevChildren: ComponentChildren): void;
        protected onContextReceive(prevContext: ComponentContext): void;
        protected onChildContextRequest(): MapLike<any>;
        protected shouldRerender(
            prevAttrs: ComponentAttrs,
            prevChildren: ComponentChildren,
            prevState: ComponentState,
            prevContext: ComponentContext
        ): boolean;
        protected abstract onRender(): VNode | null;
        protected onUpdate(
            prevAttrs: ComponentAttrs,
            prevChildren: ComponentChildren,
            prevState: ComponentState,
            prevContext: ComponentContext
        ): void;
        protected onUnmount(): void;
    }

    function node(tag: 'fragment'): FragmentVNode;
    function node(tag: 'plaintext'): TextVNode;
    function node(tag: string): TagVNode;
    function node<Attrs, State, Children, T extends Component<Attrs, State, Children>, U extends ComponentClass<Attrs, Children, T>>(
        component: U & ComponentClass<Attrs, Children, T>
        ): ComponentVNode<Attrs, Children, T, U>;
    function node<Attrs, Children, T extends FunctionComponent<Attrs, Children>> (
        component: T & FunctionComponent<Attrs, Children>
        ): FunctionComponentVNode<Attrs, Children, T>;

    function mount(elem: Element, rootVNode: BaseVNode, callback?: () => void): void;
    function mount(elem: Element, rootVNode: BaseVNode, context?: MapLike<any>, callback?: () => void): void;
    function mountSync(elem: Element, rootVNode: BaseVNode, context?: MapLike<any>): void;
    function unmount(elem: Element, callback?: () => void): void;
    function unmountSync(elem: Element): void;

    function renderToString(rootVNode: VNode): string;

    const IS_DEBUG: boolean;
}

declare global {
    namespace JSX {
        type Element = vidom.VNode;
        type ElementClass = vidom.Component;
        type ElementAttributesProperty = { attrs: {}; };
        type IntrinsicAttributes = vidom.Attributes;
        interface IntrinsicClassAttributes<T> extends vidom.ClassAttributes<T> {
        }
        interface IntrinsicElements {
            fragment: vidom.Attributes;
            plaintext: vidom.Attributes,

            a: vidom.HTMLAttributes<HTMLAnchorElement>;
            abbr: vidom.HTMLAttributes;
            address: vidom.HTMLAttributes;
            area: vidom.HTMLAttributes<HTMLAreaElement>;
            article: vidom.HTMLAttributes;
            aside: vidom.HTMLAttributes;
            audio: vidom.HTMLAttributes<HTMLAudioElement>;
            b: vidom.HTMLAttributes;
            base: vidom.HTMLAttributes<HTMLBaseElement>;
            bdi: vidom.HTMLAttributes;
            bdo: vidom.HTMLAttributes;
            big: vidom.HTMLAttributes;
            blockquote: vidom.HTMLAttributes;
            body: vidom.HTMLAttributes<HTMLBodyElement>;
            br: vidom.HTMLAttributes<HTMLBRElement>;
            button: vidom.HTMLAttributes<HTMLButtonElement>;
            canvas: vidom.HTMLAttributes<HTMLCanvasElement>;
            caption: vidom.HTMLAttributes;
            cite: vidom.HTMLAttributes;
            code: vidom.HTMLAttributes;
            col: vidom.HTMLAttributes<HTMLTableColElement>;
            colgroup: vidom.HTMLAttributes<HTMLTableColElement>;
            data: vidom.HTMLAttributes;
            datalist: vidom.HTMLAttributes<HTMLDataListElement>;
            dd: vidom.HTMLAttributes;
            del: vidom.HTMLAttributes;
            details: vidom.HTMLAttributes;
            dfn: vidom.HTMLAttributes;
            dialog: vidom.HTMLAttributes;
            div: vidom.HTMLAttributes<HTMLDivElement>;
            dl: vidom.HTMLAttributes<HTMLDListElement>;
            dt: vidom.HTMLAttributes;
            em: vidom.HTMLAttributes;
            embed: vidom.HTMLAttributes<HTMLEmbedElement>;
            fieldset: vidom.HTMLAttributes<HTMLFieldSetElement>;
            figcaption: vidom.HTMLAttributes;
            figure: vidom.HTMLAttributes;
            footer: vidom.HTMLAttributes;
            form: vidom.HTMLAttributes<HTMLFormElement>;
            h1: vidom.HTMLAttributes<HTMLHeadingElement>;
            h2: vidom.HTMLAttributes<HTMLHeadingElement>;
            h3: vidom.HTMLAttributes<HTMLHeadingElement>;
            h4: vidom.HTMLAttributes<HTMLHeadingElement>;
            h5: vidom.HTMLAttributes<HTMLHeadingElement>;
            h6: vidom.HTMLAttributes<HTMLHeadingElement>;
            head: vidom.HTMLAttributes<HTMLHeadElement>;
            header: vidom.HTMLAttributes;
            hgroup: vidom.HTMLAttributes;
            hr: vidom.HTMLAttributes<HTMLHRElement>;
            html: vidom.HTMLAttributes<HTMLHtmlElement>;
            i: vidom.HTMLAttributes;
            iframe: vidom.HTMLAttributes<HTMLIFrameElement>;
            img: vidom.HTMLAttributes<HTMLImageElement>;
            input: vidom.HTMLAttributes<HTMLInputElement>;
            ins: vidom.HTMLAttributes<HTMLModElement>;
            kbd: vidom.HTMLAttributes;
            keygen: vidom.HTMLAttributes;
            label: vidom.HTMLAttributes<HTMLLabelElement>;
            legend: vidom.HTMLAttributes<HTMLLegendElement>;
            li: vidom.HTMLAttributes<HTMLLIElement>;
            link: vidom.HTMLAttributes<HTMLLinkElement>;
            main: vidom.HTMLAttributes;
            map: vidom.HTMLAttributes<HTMLMapElement>;
            mark: vidom.HTMLAttributes;
            menu: vidom.HTMLAttributes;
            menuitem: vidom.HTMLAttributes;
            meta: vidom.HTMLAttributes<HTMLMetaElement>;
            meter: vidom.HTMLAttributes;
            nav: vidom.HTMLAttributes;
            noindex: vidom.HTMLAttributes;
            noscript: vidom.HTMLAttributes;
            object: vidom.HTMLAttributes<HTMLObjectElement>;
            ol: vidom.HTMLAttributes<HTMLOListElement>;
            optgroup: vidom.HTMLAttributes<HTMLOptGroupElement>;
            option: vidom.HTMLAttributes<HTMLOptionElement>;
            output: vidom.HTMLAttributes;
            p: vidom.HTMLAttributes<HTMLParagraphElement>;
            param: vidom.HTMLAttributes<HTMLParamElement>;
            picture: vidom.HTMLAttributes;
            pre: vidom.HTMLAttributes<HTMLPreElement>;
            progress: vidom.HTMLAttributes<HTMLProgressElement>;
            q: vidom.HTMLAttributes<HTMLQuoteElement>;
            rp: vidom.HTMLAttributes;
            rt: vidom.HTMLAttributes;
            ruby: vidom.HTMLAttributes;
            s: vidom.HTMLAttributes;
            samp: vidom.HTMLAttributes;
            script: vidom.HTMLAttributes;
            section: vidom.HTMLAttributes;
            select: vidom.HTMLAttributes<HTMLSelectElement>;
            small: vidom.HTMLAttributes;
            source: vidom.HTMLAttributes<HTMLSourceElement>;
            span: vidom.HTMLAttributes<HTMLSpanElement>;
            strong: vidom.HTMLAttributes;
            style: vidom.HTMLAttributes<HTMLStyleElement>;
            sub: vidom.HTMLAttributes;
            summary: vidom.HTMLAttributes;
            sup: vidom.HTMLAttributes;
            table: vidom.HTMLAttributes<HTMLTableElement>;
            tbody: vidom.HTMLAttributes<HTMLTableSectionElement>;
            td: vidom.HTMLAttributes<HTMLTableDataCellElement>;
            textarea: vidom.HTMLAttributes<HTMLTextAreaElement>;
            tfoot: vidom.HTMLAttributes<HTMLTableSectionElement>;
            th: vidom.HTMLAttributes<HTMLTableHeaderCellElement>;
            thead: vidom.HTMLAttributes<HTMLTableSectionElement>;
            time: vidom.HTMLAttributes;
            title: vidom.HTMLAttributes<HTMLTitleElement>;
            tr: vidom.HTMLAttributes<HTMLTableRowElement>;
            track: vidom.HTMLAttributes<HTMLTrackElement>;
            u: vidom.HTMLAttributes;
            ul: vidom.HTMLAttributes<HTMLUListElement>;
            'var': vidom.HTMLAttributes;
            video: vidom.HTMLAttributes<HTMLVideoElement>;
            wbr: vidom.HTMLAttributes;

            // SVG
            svg: vidom.SVGAttributes<SVGSVGElement> & { ns: string };

            animate: vidom.SVGAttributes<SVGElement>;
            circle: vidom.SVGAttributes<SVGCircleElement>;
            clipPath: vidom.SVGAttributes<SVGClipPathElement>;
            defs: vidom.SVGAttributes<SVGDefsElement>;
            desc: vidom.SVGAttributes<SVGDescElement>;
            ellipse: vidom.SVGAttributes<SVGEllipseElement>;
            feBlend: vidom.SVGAttributes<SVGFEBlendElement>;
            feColorMatrix: vidom.SVGAttributes<SVGFEColorMatrixElement>;
            feComponentTransfer: vidom.SVGAttributes<SVGFEComponentTransferElement>;
            feComposite: vidom.SVGAttributes<SVGFECompositeElement>;
            feConvolveMatrix: vidom.SVGAttributes<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: vidom.SVGAttributes<SVGFEDiffuseLightingElement>;
            feDisplacementMap: vidom.SVGAttributes<SVGFEDisplacementMapElement>;
            feDistantLight: vidom.SVGAttributes<SVGFEDistantLightElement>;
            feFlood: vidom.SVGAttributes<SVGFEFloodElement>;
            feFuncA: vidom.SVGAttributes<SVGFEFuncAElement>;
            feFuncB: vidom.SVGAttributes<SVGFEFuncBElement>;
            feFuncG: vidom.SVGAttributes<SVGFEFuncGElement>;
            feFuncR: vidom.SVGAttributes<SVGFEFuncRElement>;
            feGaussianBlur: vidom.SVGAttributes<SVGFEGaussianBlurElement>;
            feImage: vidom.SVGAttributes<SVGFEImageElement>;
            feMerge: vidom.SVGAttributes<SVGFEMergeElement>;
            feMergeNode: vidom.SVGAttributes<SVGFEMergeNodeElement>;
            feMorphology: vidom.SVGAttributes<SVGFEMorphologyElement>;
            feOffset: vidom.SVGAttributes<SVGFEOffsetElement>;
            fePointLight: vidom.SVGAttributes<SVGFEPointLightElement>;
            feSpecularLighting: vidom.SVGAttributes<SVGFESpecularLightingElement>;
            feSpotLight: vidom.SVGAttributes<SVGFESpotLightElement>;
            feTile: vidom.SVGAttributes<SVGFETileElement>;
            feTurbulence: vidom.SVGAttributes<SVGFETurbulenceElement>;
            filter: vidom.SVGAttributes<SVGFilterElement>;
            foreignObject: vidom.SVGAttributes<SVGForeignObjectElement>;
            g: vidom.SVGAttributes<SVGGElement>;
            image: vidom.SVGAttributes<SVGImageElement>;
            line: vidom.SVGAttributes<SVGLineElement>;
            linearGradient: vidom.SVGAttributes<SVGLinearGradientElement>;
            marker: vidom.SVGAttributes<SVGMarkerElement>;
            mask: vidom.SVGAttributes<SVGMaskElement>;
            metadata: vidom.SVGAttributes<SVGMetadataElement>;
            path: vidom.SVGAttributes<SVGPathElement>;
            pattern: vidom.SVGAttributes<SVGPatternElement>;
            polygon: vidom.SVGAttributes<SVGPolygonElement>;
            polyline: vidom.SVGAttributes<SVGPolylineElement>;
            radialGradient: vidom.SVGAttributes<SVGRadialGradientElement>;
            rect: vidom.SVGAttributes<SVGRectElement>;
            stop: vidom.SVGAttributes<SVGStopElement>;
            switch: vidom.SVGAttributes<SVGSwitchElement>;
            symbol: vidom.SVGAttributes<SVGSymbolElement>;
            text: vidom.SVGAttributes<SVGTextElement>;
            textPath: vidom.SVGAttributes<SVGTextPathElement>;
            tspan: vidom.SVGAttributes<SVGTSpanElement>;
            use: vidom.SVGAttributes<SVGUseElement>;
            view: vidom.SVGAttributes<SVGViewElement>;
        }
    }
}
