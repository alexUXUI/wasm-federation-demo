extern crate console_error_panic_hook;
use std::cell::RefCell;
use std::f64;
use std::panic;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
// use web_sys::console;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}


macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

fn window() -> web_sys::Window {
    web_sys::window().expect("no global `window` exists")
}

fn request_animation_frame(f: &Closure<dyn FnMut()>) {
    window()
        .request_animation_frame(f.as_ref().unchecked_ref())
        .expect("should register `requestAnimationFrame` OK");
}

async fn load_and_play_file() -> Result<web_sys::AnalyserNode, JsValue> {
    let document = web_sys::window().unwrap().document().unwrap();

    let file_input: web_sys::HtmlInputElement = document
        .get_element_by_id("file-input")
        .unwrap()
        .dyn_into::<web_sys::HtmlInputElement>()
        .map_err(|_| ())
        .unwrap();

    let file: web_sys::File = file_input.files().unwrap().get(0).unwrap();

    let audio_ctx = web_sys::AudioContext::new()?;

    let ab: js_sys::ArrayBuffer = wasm_bindgen_futures::JsFuture::from(file.array_buffer())
        .await?
        .dyn_into()
        .unwrap();

    let buf: web_sys::AudioBuffer =
        wasm_bindgen_futures::JsFuture::from(audio_ctx.decode_audio_data(&ab).unwrap())
            .await?
            .dyn_into()
            .unwrap();

    let source = audio_ctx.create_buffer_source().unwrap();

    source.set_buffer(Some(&buf));

    let analyser = audio_ctx.create_analyser()?;
    analyser.set_fft_size(2048);

    source.connect_with_audio_node(&analyser)?;
    analyser.connect_with_audio_node(&audio_ctx.destination())?;

    source.start()?;

    Ok(analyser)
}

struct Visualizer {
    height: u32,
    width: u32,
    canvas: web_sys::HtmlCanvasElement,
    ctx: web_sys::CanvasRenderingContext2d,
    buf: [u8; 2048],
}

impl Visualizer {
    fn draw(&mut self, analyzer: &web_sys::AnalyserNode) {
        // get dimensions in f64
        let height = f64::from(self.height);
        let width = f64::from(self.width);

        // clear canvas
        self.ctx.set_fill_style(&"rgb(0, 0, 0)".into());
        self.ctx.fill_rect(0., 0., width, height);

        // set the sound data in the state buffer
        analyzer.get_byte_frequency_data(&mut self.buf);

        // get the buffer length
        let buffer_length = analyzer.frequency_bin_count();

        // set bar width to be the with divided by the data points
        let bar_width = (self.width / buffer_length);

        // set the bar offset to be mutable so that we 
        // can format the bars side-by-side
        let mut bar_x_offset = 0.;

        // for each data point, draw a bar
        for i in 0..buffer_length {
            // let amp = f64::from(self.buf[i]) / 256.0;
            
            let bar_height = f64::from(self.buf[i as usize]);

            // calculate the rgb color of the bar
            let r = bar_height + 25.0 * (i as f64 / buffer_length as f64);
            let g = 20.0 * (i as f64 / buffer_length as f64);
            let b = 200.0 * (i as f64 / buffer_length as f64);

            // ctx.fillStyle = `rgb(${r},${g},${b})`;

            // this sets the color
            self.ctx.set_fill_style(&format!("rgb({}, {}, {})", r,g,b).into());
            
            self.ctx
                .fill_rect(
                    bar_x_offset, 
                    height - bar_height, 
                    f64::from(bar_height), 
                    f64::from(i as f64 * 3.)
                );
            
            bar_x_offset += f64::from(bar_width);

            self.ctx.fill();
        }
    }
}

#[wasm_bindgen]
pub async fn run() -> Result<(), JsValue> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    // use the question mark here for unsafe access, 
    // basically the shortcut to unwrappingit
    let analyser = load_and_play_file().await?;

    // this code doesnt run at first, only when a file is uploaded. 
    // This is becuse of the await statement above.

    // once the file is loaded, we can get the document, canvas, and context
    let document = web_sys::window().unwrap().document().unwrap();
    let canvas = document.get_element_by_id("canvas").unwrap();
    let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

    let context = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();

    let mut vis = Visualizer {
        height: canvas.height(),
        width: canvas.width(),
        canvas: canvas,
        ctx: context,
        buf: [0; 2048],
    };

    // we're using an `Rc`. The `Rc` will eventually store the
    // closure we want to execute on each frame, but to start out it contains
    // `None`.
    //
    // After the `Rc` is made we'll actually create the closure, and the closure
    // will reference one of the `Rc` instances. The other `Rc` reference is
    // used to store the closure, request the first frame, and then is dropped
    // by this function.
    let f = Rc::new(RefCell::new(None));
    let g = f.clone();

    // const bufferLength = analyser.frequencyBinCount; // 1024
    
    // this is the closure that will be called on each frame
    *g.borrow_mut() = Some(Closure::wrap(Box::new(move || {
        analyser.get_byte_time_domain_data(&mut vis.buf);
        vis.draw(&analyser);

        // Schedule ourself for another requestAnimationFrame callback.
        request_animation_frame(f.borrow().as_ref().unwrap());
    }) as Box<dyn FnMut()>));

    request_animation_frame(g.borrow().as_ref().unwrap());

    Ok(())
}