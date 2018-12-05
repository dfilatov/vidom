// TypeScript Version: 3.0

import * as CSS from 'csstype';

export = vidom;
export as namespace vidom;

type MapLike<T = any> = Record<string, any>;

type DOMElement = Element;

declare namespace vidom {
    type Key = string | number;
    type Ref<T> = (ref: T | null) => void;

    interface FunctionComponent<
        TAttrs extends MapLike = {},
        TChildren = any,
        TContext extends MapLike = {}
    > {
        (attrs: TAttrs, children: TChildren, context: TContext): Element | null;
        defaultAttrs?: Partial<TAttrs>;
    }

    interface ComponentClass<
        TAttrs extends MapLike = {},
        TChildren = any,
        TContext extends MapLike = {},
        TComponent = Component<TAttrs, TChildren, {}, TContext>
    > {
        new (attrs: TAttrs, children: TChildren, context: TContext): TComponent;
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
        TChildren = any,
        TState extends MapLike = {},
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
        protected onChange(
            prevAttrs: TAttrs,
            prevChildren: TChildren,
            prevState: TState,
            prevContext: TContext
        ): void;
        protected onChildContextRequest(): TChildContext;
        protected shouldRerender(
            prevAttrs: TAttrs,
            prevChildren: TChildren,
            prevState: TState,
            prevContext: TContext
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
        TComponent extends Component<TAttrs, TChildren> = Component<TAttrs, TChildren>,
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
            attrs?: Partial<TAttrs> | null,
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
            attrs?: Partial<TAttrs> | null,
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

    interface DOMEventHandler<TEvent extends Event = Event> {
        (event: TEvent): void;
    }

    interface DOMAttributes {
        onAnimationEnd?: DOMEventHandler;
        onAnimationIteration?: DOMEventHandler;
        onAnimationStart?: DOMEventHandler;
        onBlur?: DOMEventHandler<FocusEvent>;
        onCanPlay?: DOMEventHandler;
        onCanPlayThrough?: DOMEventHandler;
        onChange?: DOMEventHandler;
        onClick?: DOMEventHandler<MouseEvent>;
        onComplete?: DOMEventHandler;
        onContextMenu?: DOMEventHandler;
        onCopy?: DOMEventHandler;
        onCut?: DOMEventHandler;
        onDblClick?: DOMEventHandler<MouseEvent>;
        onDrag?: DOMEventHandler<DragEvent>;
        onDragEnd?: DOMEventHandler<DragEvent>;
        onDragEnter?: DOMEventHandler<DragEvent>;
        onDragLeave?: DOMEventHandler<DragEvent>;
        onDragOver?: DOMEventHandler<DragEvent>;
        onDragStart?: DOMEventHandler<DragEvent>;
        onDrop?: DOMEventHandler<DragEvent>;
        onDurationChange?: DOMEventHandler;
        onEmptied?: DOMEventHandler;
        onEnded?: DOMEventHandler;
        onError?: DOMEventHandler;
        onFocus?: DOMEventHandler<FocusEvent>;
        onGotPointerCapture?: DOMEventHandler<PointerEvent>;
        onInput?: DOMEventHandler;
        onKeyDown?: DOMEventHandler<KeyboardEvent>;
        onKeyPress?: DOMEventHandler<KeyboardEvent>;
        onKeyUp?: DOMEventHandler<KeyboardEvent>;
        onLoad?: DOMEventHandler;
        onLoadedData?: DOMEventHandler;
        onLoadedMetadata?: DOMEventHandler;
        onLoadStart?: DOMEventHandler;
        onLostPointerCapture?: DOMEventHandler<PointerEvent>;
        onMouseDown?: DOMEventHandler<MouseEvent>;
        onMouseEnter?: DOMEventHandler<MouseEvent>;
        onMouseLeave?: DOMEventHandler<MouseEvent>;
        onMouseMove?: DOMEventHandler<MouseEvent>;
        onMouseOut?: DOMEventHandler<MouseEvent>;
        onMouseOver?: DOMEventHandler<MouseEvent>;
        onMouseUp?: DOMEventHandler<MouseEvent>;
        onPaste?: DOMEventHandler;
        onPause?: DOMEventHandler;
        onPlay?: DOMEventHandler;
        onPlaying?: DOMEventHandler;
        onPointerCancel?: DOMEventHandler<PointerEvent>;
        onPointerDown?: DOMEventHandler<PointerEvent>;
        onPointerEnter?: DOMEventHandler<PointerEvent>;
        onPointerLeave?: DOMEventHandler<PointerEvent>;
        onPointerMove?: DOMEventHandler<PointerEvent>;
        onPointerOut?: DOMEventHandler<PointerEvent>;
        onPointerOver?: DOMEventHandler<PointerEvent>;
        onPointerUp?: DOMEventHandler<PointerEvent>;
        onProgress?: DOMEventHandler;
        onRateChange?: DOMEventHandler;
        onScroll?: DOMEventHandler;
        onSeeked?: DOMEventHandler;
        onSeeking?: DOMEventHandler;
        onSelect?: DOMEventHandler;
        onStalled?: DOMEventHandler;
        onSubmit?: DOMEventHandler;
        onSuspend?: DOMEventHandler;
        onTimeUpdate?: DOMEventHandler;
        onTouchCancel?: DOMEventHandler<TouchEvent>;
        onTouchEnd?: DOMEventHandler<TouchEvent>;
        onTouchMove?: DOMEventHandler<TouchEvent>;
        onTouchStart?: DOMEventHandler<TouchEvent>;
        onTransitionEnd?: DOMEventHandler;
        onVolumeChange?: DOMEventHandler;
        onWaiting?: DOMEventHandler;
        onWheel?: DOMEventHandler<WheelEvent>;
    }

    type CSSProperties = {
        [key in keyof CSS.Properties]: CSS.Properties[key] | null;
    }

    interface HTMLAttributes extends DOMAttributes {
        accessKey?: string;
        'aria-activedescendant'?: string;
        'aria-atomic'?: boolean | 'false' | 'true';
        'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
        'aria-busy'?: boolean | 'false' | 'true';
        'aria-checked'?: boolean | 'false' | 'mixed' | 'true';
        'aria-colcount'?: number;
        'aria-colindex'?: number;
        'aria-colspan'?: number;
        'aria-controls'?: string;
        'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
        'aria-describedby'?: string;
        'aria-details'?: string;
        'aria-disabled'?: boolean | 'false' | 'true';
        'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
        'aria-errormessage'?: string;
        'aria-expanded'?: boolean | 'false' | 'true';
        'aria-flowto'?: string;
        'aria-grabbed'?: boolean | 'false' | 'true';
        'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
        'aria-hidden'?: boolean | 'false' | 'true';
        'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
        'aria-keyshortcuts'?: string;
        'aria-label'?: string;
        'aria-labelledby'?: string;
        'aria-level'?: number;
        'aria-live'?: 'off' | 'assertive' | 'polite';
        'aria-modal'?: boolean | 'false' | 'true';
        'aria-multiline'?: boolean | 'false' | 'true';
        'aria-multiselectable'?: boolean | 'false' | 'true';
        'aria-orientation'?: 'horizontal' | 'vertical';
        'aria-owns'?: string;
        'aria-placeholder'?: string;
        'aria-posinset'?: number;
        'aria-pressed'?: boolean | 'false' | 'mixed' | 'true';
        'aria-readonly'?: boolean | 'false' | 'true';
        'aria-relevant'?: 'additions' | 'additions text' | 'all' | 'removals' | 'text';
        'aria-required'?: boolean | 'false' | 'true';
        'aria-roledescription'?: string;
        'aria-rowcount'?: number;
        'aria-rowindex'?: number;
        'aria-rowspan'?: number;
        'aria-selected'?: boolean | 'false' | 'true';
        'aria-setsize'?: number;
        'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
        'aria-valuemax'?: number;
        'aria-valuemin'?: number;
        'aria-valuenow'?: number;
        'aria-valuetext'?: string;
        class?: string;
        contentEditable?: boolean;
        contextMenu?: string;
        dir?: string;
        draggable?: boolean;
        hidden?: boolean;
        html?: string,
        id?: string;
        inputMode?: string;
        is?: string;
        lang?: string;
        placeholder?: string;
        radioGroup?: string;
        role?: string;
        slot?: string;
        spellCheck?: boolean;
        style?: CSSProperties;
        tabIndex?: number;
        title?: string;

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
        unselectable?: 'on' | 'off';
    }

    interface AnchorHTMLAttributes extends HTMLAttributes {
        download?: any;
        href?: string;
        hrefLang?: string;
        media?: string;
        rel?: string;
        target?: string;
        type?: string;
    }

    interface AreaHTMLAttributes extends HTMLAttributes {
        alt?: string;
        coords?: string;
        download?: any;
        href?: string;
        hrefLang?: string;
        media?: string;
        rel?: string;
        shape?: string;
        target?: string;
    }

    interface BaseHTMLAttributes extends HTMLAttributes {
        href?: string;
        target?: string;
    }

    interface BlockquoteHTMLAttributes extends HTMLAttributes {
        cite?: string;
    }

    interface ButtonHTMLAttributes extends HTMLAttributes {
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        type?: string;
        value?: string | string[] | number;
    }

    interface CanvasHTMLAttributes extends HTMLAttributes {
        height?: number | string;
        width?: number | string;
    }

    interface ColHTMLAttributes extends HTMLAttributes {
        span?: number;
        width?: number | string;
    }

    interface ColgroupHTMLAttributes extends HTMLAttributes {
        span?: number;
    }

    interface DetailsHTMLAttributes extends HTMLAttributes {
        open?: boolean;
    }

    interface DelHTMLAttributes extends HTMLAttributes {
        cite?: string;
        dateTime?: string;
    }

    interface DialogHTMLAttributes extends HTMLAttributes {
        open?: boolean;
    }

    interface EmbedHTMLAttributes extends HTMLAttributes {
        height?: number | string;
        src?: string;
        type?: string;
        width?: number | string;
    }

    interface FieldsetHTMLAttributes extends HTMLAttributes {
        disabled?: boolean;
        form?: string;
        name?: string;
    }

    interface FormHTMLAttributes extends HTMLAttributes {
        acceptCharset?: string;
        action?: string;
        autoComplete?: string;
        encType?: string;
        method?: string;
        name?: string;
        noValidate?: boolean;
        target?: string;
    }

    interface HtmlHTMLAttributes extends HTMLAttributes {
        manifest?: string;
    }

    interface IframeHTMLAttributes extends HTMLAttributes {
        allow?: string;
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        frameBorder?: number | string;
        height?: number | string;
        marginHeight?: number;
        marginWidth?: number;
        name?: string;
        sandbox?: string;
        scrolling?: string;
        seamless?: boolean;
        src?: string;
        srcDoc?: string;
        width?: number | string;
    }

    interface ImgHTMLAttributes extends HTMLAttributes {
        alt?: string;
        crossOrigin?: 'anonymous' | 'use-credentials' | '';
        decoding?: 'async' | 'auto' | 'sync';
        height?: number | string;
        sizes?: string;
        src?: string;
        srcSet?: string;
        useMap?: string;
        width?: number | string;
    }

    interface InsHTMLAttributes extends HTMLAttributes {
        cite?: string;
        dateTime?: string;
    }

    interface InputHTMLAttributes extends HTMLAttributes {
        accept?: string;
        alt?: string;
        autoComplete?: string;
        autoFocus?: boolean;
        capture?: boolean | string;
        checked?: boolean;
        crossOrigin?: string;
        disabled?: boolean;
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        height?: number | string;
        list?: string;
        max?: number | string;
        maxLength?: number;
        min?: number | string;
        minLength?: number;
        multiple?: boolean;
        name?: string;
        pattern?: string;
        readOnly?: boolean;
        required?: boolean;
        size?: number;
        src?: string;
        step?: number | string;
        type?: string;
        value?: string | string[] | number;
        width?: number | string;
    }

    interface KeygenHTMLAttributes extends HTMLAttributes {
        autoFocus?: boolean;
        challenge?: string;
        disabled?: boolean;
        form?: string;
        keyType?: string;
        keyParams?: string;
        name?: string;
    }

    interface LabelHTMLAttributes extends HTMLAttributes {
        form?: string;
        for?: string;
    }

    interface LiHTMLAttributes extends HTMLAttributes {
        value?: string | string[] | number;
    }

    interface LinkHTMLAttributes extends HTMLAttributes {
        as?: string;
        crossOrigin?: string;
        href?: string;
        hrefLang?: string;
        integrity?: string;
        media?: string;
        rel?: string;
        sizes?: string;
        type?: string;
    }

    interface MapHTMLAttributes extends HTMLAttributes {
        name?: string;
    }

    interface MenuHTMLAttributes extends HTMLAttributes {
        type?: string;
    }

    interface MediaHTMLAttributes extends HTMLAttributes {
        autoPlay?: boolean;
        controls?: boolean;
        controlsList?: string;
        crossOrigin?: string;
        loop?: boolean;
        mediaGroup?: string;
        muted?: boolean;
        playsinline?: boolean;
        preload?: string;
        src?: string;
    }

    interface MetaHTMLAttributes extends HTMLAttributes {
        charSet?: string;
        content?: string;
        httpEquiv?: string;
        name?: string;
    }

    interface MeterHTMLAttributes extends HTMLAttributes {
        form?: string;
        high?: number;
        low?: number;
        max?: number | string;
        min?: number | string;
        optimum?: number;
        value?: string | string[] | number;
    }

    interface QuoteHTMLAttributes extends HTMLAttributes {
        cite?: string;
    }

    interface ObjectHTMLAttributes extends HTMLAttributes {
        classID?: string;
        data?: string;
        form?: string;
        height?: number | string;
        name?: string;
        type?: string;
        useMap?: string;
        width?: number | string;
        wmode?: string;
    }

    interface OlHTMLAttributes extends HTMLAttributes {
        reversed?: boolean;
        start?: number;
        type?: '1' | 'a' | 'A' | 'i' | 'I';
    }

    interface OptgroupHTMLAttributes extends HTMLAttributes {
        disabled?: boolean;
        label?: string;
    }

    interface OptionHTMLAttributes extends HTMLAttributes {
        disabled?: boolean;
        label?: string;
        selected?: boolean;
        value?: string | string[] | number;
    }

    interface OutputHTMLAttributes extends HTMLAttributes {
        form?: string;
        for?: string;
        name?: string;
    }

    interface ParamHTMLAttributes extends HTMLAttributes {
        name?: string;
        value?: string | string[] | number;
    }

    interface ProgressHTMLAttributes extends HTMLAttributes {
        max?: number | string;
        value?: string | string[] | number;
    }

    interface ScriptHTMLAttributes extends HTMLAttributes {
        async?: boolean;
        charSet?: string;
        crossOrigin?: string;
        defer?: boolean;
        integrity?: string;
        noModule?: boolean;
        nonce?: string;
        src?: string;
        type?: string;
    }

    interface SelectHTMLAttributes extends HTMLAttributes {
        autoComplete?: string;
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        multiple?: boolean;
        name?: string;
        required?: boolean;
        size?: number;
        value?: string | string[] | number;
    }

    interface SourceHTMLAttributes extends HTMLAttributes {
        media?: string;
        sizes?: string;
        src?: string;
        srcSet?: string;
        type?: string;
    }

    interface StyleHTMLAttributes extends HTMLAttributes {
        media?: string;
        nonce?: string;
        scoped?: boolean;
        type?: string;
    }

    interface TableHTMLAttributes extends HTMLAttributes {
        cellPadding?: number | string;
        cellSpacing?: number | string;
        summary?: string;
    }

    interface TextareaHTMLAttributes extends HTMLAttributes {
        autoComplete?: string;
        autoFocus?: boolean;
        cols?: number;
        dirName?: string;
        disabled?: boolean;
        form?: string;
        maxLength?: number;
        minLength?: number;
        name?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        rows?: number;
        value?: string | string[] | number;
        wrap?: string;
    }

    interface TdHTMLAttributes extends HTMLAttributes {
        align?: 'left' | 'center' | 'right' | 'justify' | 'char';
        colSpan?: number;
        headers?: string;
        rowSpan?: number;
        scope?: string;
    }

    interface ThHTMLAttributes extends HTMLAttributes {
        align?: 'left' | 'center' | 'right' | 'justify' | 'char';
        colSpan?: number;
        headers?: string;
        rowSpan?: number;
        scope?: string;
    }

    interface TimeHTMLAttributes extends HTMLAttributes {
        dateTime?: string;
    }

    interface TrackHTMLAttributes extends HTMLAttributes {
        default?: boolean;
        kind?: string;
        label?: string;
        src?: string;
        srcLang?: string;
    }

    interface VideoHTMLAttributes extends MediaHTMLAttributes {
        height?: number | string;
        poster?: string;
        width?: number | string;
    }

    interface SVGAttributes extends DOMAttributes {
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
        style?: CSSProperties;
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
        ref?: Ref<HTMLElement | SVGElement> | null,
        escapeChildren?: boolean
    ): TagElement;
    function elem<TAttrs, TChildren, TFunctionComponent extends FunctionComponent<TAttrs, TChildren>> (
        component: TFunctionComponent & FunctionComponent<TAttrs, TChildren>,
        key?: Key | null,
        attrs?: TAttrs,
        children?: TChildren
    ): FunctionComponentElement<TAttrs, TChildren, TFunctionComponent>;
    function elem<
        TAttrs,
        TChildren,
        TComponentClass extends ComponentClass<TAttrs, TChildren, TComponent>,
        TComponent extends Component<TAttrs, TChildren>,
    >(
        component: TComponentClass & ComponentClass<TAttrs, TChildren, TComponent>,
        key?: Key | null,
        attrs?: TAttrs,
        children?: TChildren,
        ref?: Ref<TComponent> | null
    ): ComponentElement<TAttrs, TChildren, TComponent, TComponentClass>;

    function mount(domElem: DOMElement, node: Node, callback?: () => void): void;
    function mount(domElem: DOMElement, node: Node, context?: MapLike, callback?: () => void): void;
    function mountSync(domElem: DOMElement, node: Node, context?: MapLike): void;
    function unmount(domElem: DOMElement, callback?: () => void): void;
    function unmountSync(domElem: DOMElement): void;

    function renderToString(node: Node): string;

    function toElem(node: Node): Element;
    function toElems(node: Node): Element[];

    function h(
        tag: 'fragment',
        props: WithKey | null,
        ...children: Node[]
    ): FragmentElement;
    function h(
        tag: 'plaintext',
        props: WithKey | null,
        ...children: string[]
    ): TextElement;
    function h(
        tag: string,
        props: (
            (
                (HTMLAttributes & WithRef<HTMLElement>) |
                (SVGAttributes & WithRef<SVGElement>)
            ) &
            WithKey
        ) | null,
        ...children: Node[]
    ): TagElement;
    function h<TAttrs, TChildren, TFunctionComponent extends FunctionComponent<TAttrs, TChildren>> (
        component: TFunctionComponent & FunctionComponent<TAttrs, TChildren>,
        props: (TAttrs & WithKey) | null,
        children?: TChildren
    ): FunctionComponentElement<TAttrs, TChildren, TFunctionComponent>;
    function h<
        TAttrs,
        TChildren,
        TComponentClass extends ComponentClass<TAttrs, TChildren, TComponent>,
        TComponent extends Component<TAttrs, TChildren>,
    >(
        component: TComponentClass & ComponentClass<TAttrs, TChildren, TComponent>,
        props: (TAttrs & WithRef<vidom.Component> & WithKey) | null,
        children?: TChildren
    ): ComponentElement<TAttrs, TChildren, TComponent, TComponentClass>;

    const IS_DEBUG: boolean;
}

declare global {
    namespace JSX {
        type Element = vidom.Element;
        type ElementClass = vidom.Component;
        type ElementAttributesProperty = { attrs: {}; };
        // type LibraryManagedAttributes<TComponent, TAttrs> = TComponent extends { defaultAttrs: infer DefaultAttrs; }?
        //     TAttrs extends any?
        //         string extends keyof TAttrs?
        //             TAttrs :
        //             Pick<TAttrs, Exclude<keyof TAttrs, keyof DefaultAttrs>> &
        //                 Partial<Pick<TAttrs, Extract<keyof TAttrs, keyof DefaultAttrs>>> &
        //                 Partial<Pick<DefaultAttrs, Exclude<keyof DefaultAttrs, keyof TAttrs>>> :
        //         never :
        //     TAttrs;

        interface IntrinsicAttributes extends vidom.WithKey {}
        interface IntrinsicClassAttributes extends vidom.WithKey, vidom.WithRef<vidom.Component> {}
        type IntrinsicHTMLAttributes<
            THTMLAttributes extends vidom.HTMLAttributes = vidom.HTMLAttributes,
            THTMLElement extends HTMLElement = HTMLElement
        > = THTMLAttributes & vidom.HTMLAttributes & vidom.WithRef<THTMLElement> & vidom.WithKey;
        interface IntrinsicSVGAttributes<TSVGElement extends SVGElement>
            extends vidom.SVGAttributes, vidom.WithRef<TSVGElement>, vidom.WithKey {}

        interface IntrinsicElements {
            fragment: vidom.WithKey;
            plaintext: vidom.WithKey;

            a: IntrinsicHTMLAttributes<vidom.AnchorHTMLAttributes, HTMLAnchorElement>;
            abbr: IntrinsicHTMLAttributes;
            address: IntrinsicHTMLAttributes;
            area: IntrinsicHTMLAttributes<vidom.AreaHTMLAttributes, HTMLAreaElement>;
            article: IntrinsicHTMLAttributes;
            aside: IntrinsicHTMLAttributes;
            audio: IntrinsicHTMLAttributes<vidom.MediaHTMLAttributes, HTMLAudioElement>;
            b: IntrinsicHTMLAttributes;
            base: IntrinsicHTMLAttributes<vidom.BaseHTMLAttributes, HTMLBaseElement>;
            bdi: IntrinsicHTMLAttributes;
            bdo: IntrinsicHTMLAttributes;
            big: IntrinsicHTMLAttributes;
            blockquote: IntrinsicHTMLAttributes<vidom.BlockquoteHTMLAttributes>;
            body: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLBodyElement>;
            br: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLBRElement>;
            button: IntrinsicHTMLAttributes<vidom.ButtonHTMLAttributes, HTMLButtonElement>;
            canvas: IntrinsicHTMLAttributes<vidom.CanvasHTMLAttributes, HTMLCanvasElement>;
            caption: IntrinsicHTMLAttributes;
            cite: IntrinsicHTMLAttributes;
            code: IntrinsicHTMLAttributes;
            col: IntrinsicHTMLAttributes<vidom.ColHTMLAttributes, HTMLTableColElement>;
            colgroup: IntrinsicHTMLAttributes<vidom.ColgroupHTMLAttributes, HTMLTableColElement>;
            data: IntrinsicHTMLAttributes;
            datalist: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLDataListElement>;
            dd: IntrinsicHTMLAttributes;
            del: IntrinsicHTMLAttributes<vidom.DelHTMLAttributes>;
            details: IntrinsicHTMLAttributes<vidom.DetailsHTMLAttributes>;
            dfn: IntrinsicHTMLAttributes;
            dialog: IntrinsicHTMLAttributes<vidom.DialogHTMLAttributes, HTMLDialogElement>;
            div: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLDivElement>;
            dl: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLDListElement>;
            dt: IntrinsicHTMLAttributes;
            em: IntrinsicHTMLAttributes;
            embed: IntrinsicHTMLAttributes<vidom.EmbedHTMLAttributes, HTMLEmbedElement>;
            fieldset: IntrinsicHTMLAttributes<vidom.FieldsetHTMLAttributes, HTMLFieldSetElement>;
            figcaption: IntrinsicHTMLAttributes;
            figure: IntrinsicHTMLAttributes;
            footer: IntrinsicHTMLAttributes;
            form: IntrinsicHTMLAttributes<vidom.FormHTMLAttributes, HTMLFormElement>;
            h1: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLHeadingElement>;
            h2: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLHeadingElement>;
            h3: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLHeadingElement>;
            h4: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLHeadingElement>;
            h5: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLHeadingElement>;
            h6: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLHeadingElement>;
            head: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLHeadElement>;
            header: IntrinsicHTMLAttributes;
            hgroup: IntrinsicHTMLAttributes;
            hr: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLHRElement>;
            html: IntrinsicHTMLAttributes<vidom.HtmlHTMLAttributes, HTMLHtmlElement>;
            i: IntrinsicHTMLAttributes;
            iframe: IntrinsicHTMLAttributes<vidom.IframeHTMLAttributes, HTMLIFrameElement>;
            img: IntrinsicHTMLAttributes<vidom.ImgHTMLAttributes, HTMLImageElement>;
            input: IntrinsicHTMLAttributes<vidom.InputHTMLAttributes, HTMLInputElement>;
            ins: IntrinsicHTMLAttributes<vidom.InsHTMLAttributes, HTMLModElement>;
            kbd: IntrinsicHTMLAttributes;
            keygen: IntrinsicHTMLAttributes<vidom.KeygenHTMLAttributes>;
            label: IntrinsicHTMLAttributes<vidom.LabelHTMLAttributes, HTMLLabelElement>;
            legend: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLLegendElement>;
            li: IntrinsicHTMLAttributes<vidom.LiHTMLAttributes, HTMLLIElement>;
            link: IntrinsicHTMLAttributes<vidom.LinkHTMLAttributes, HTMLLinkElement>;
            main: IntrinsicHTMLAttributes;
            map: IntrinsicHTMLAttributes<vidom.MapHTMLAttributes, HTMLMapElement>;
            mark: IntrinsicHTMLAttributes;
            menu: IntrinsicHTMLAttributes<vidom.MenuHTMLAttributes>;
            menuitem: IntrinsicHTMLAttributes;
            meta: IntrinsicHTMLAttributes<vidom.MetaHTMLAttributes, HTMLMetaElement>;
            meter: IntrinsicHTMLAttributes<vidom.MeterHTMLAttributes>;
            nav: IntrinsicHTMLAttributes;
            noindex: IntrinsicHTMLAttributes;
            noscript: IntrinsicHTMLAttributes;
            object: IntrinsicHTMLAttributes<vidom.ObjectHTMLAttributes, HTMLObjectElement>;
            ol: IntrinsicHTMLAttributes<vidom.OlHTMLAttributes, HTMLOListElement>;
            optgroup: IntrinsicHTMLAttributes<vidom.OptgroupHTMLAttributes, HTMLOptGroupElement>;
            option: IntrinsicHTMLAttributes<vidom.OptionHTMLAttributes, HTMLOptionElement>;
            output: IntrinsicHTMLAttributes<vidom.HTMLAttributes>;
            p: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLParagraphElement>;
            param: IntrinsicHTMLAttributes<vidom.ParamHTMLAttributes, HTMLParamElement>;
            picture: IntrinsicHTMLAttributes;
            pre: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLPreElement>;
            progress: IntrinsicHTMLAttributes<vidom.ProgressHTMLAttributes, HTMLProgressElement>;
            q: IntrinsicHTMLAttributes<vidom.QuoteHTMLAttributes, HTMLQuoteElement>;
            rp: IntrinsicHTMLAttributes;
            rt: IntrinsicHTMLAttributes;
            ruby: IntrinsicHTMLAttributes;
            s: IntrinsicHTMLAttributes;
            samp: IntrinsicHTMLAttributes;
            script: IntrinsicHTMLAttributes<vidom.ScriptHTMLAttributes, HTMLScriptElement>;
            section: IntrinsicHTMLAttributes;
            select: IntrinsicHTMLAttributes<vidom.SelectHTMLAttributes, HTMLSelectElement>;
            small: IntrinsicHTMLAttributes;
            source: IntrinsicHTMLAttributes<vidom.SourceHTMLAttributes, HTMLSourceElement>;
            span: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLSpanElement>;
            strong: IntrinsicHTMLAttributes;
            style: IntrinsicHTMLAttributes<vidom.StyleHTMLAttributes, HTMLStyleElement>;
            sub: IntrinsicHTMLAttributes;
            summary: IntrinsicHTMLAttributes;
            sup: IntrinsicHTMLAttributes;
            table: IntrinsicHTMLAttributes<vidom.TableHTMLAttributes, HTMLTableElement>;
            tbody: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLTableSectionElement>;
            td: IntrinsicHTMLAttributes<vidom.TdHTMLAttributes, HTMLTableDataCellElement>;
            textarea: IntrinsicHTMLAttributes<vidom.TextareaHTMLAttributes, HTMLTextAreaElement>;
            tfoot: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLTableSectionElement>;
            th: IntrinsicHTMLAttributes<vidom.ThHTMLAttributes, HTMLTableHeaderCellElement>;
            thead: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLTableSectionElement>;
            time: IntrinsicHTMLAttributes<vidom.TimeHTMLAttributes>;
            title: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLTitleElement>;
            tr: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLTableRowElement>;
            track: IntrinsicHTMLAttributes<vidom.TrackHTMLAttributes, HTMLTrackElement>;
            u: IntrinsicHTMLAttributes;
            ul: IntrinsicHTMLAttributes<vidom.HTMLAttributes, HTMLUListElement>;
            'var': IntrinsicHTMLAttributes;
            video: IntrinsicHTMLAttributes<vidom.VideoHTMLAttributes, HTMLVideoElement>;
            wbr: IntrinsicHTMLAttributes;

            // SVG
            svg: IntrinsicSVGAttributes<SVGSVGElement>;

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
