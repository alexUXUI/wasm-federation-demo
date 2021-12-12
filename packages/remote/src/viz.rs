use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
pub fn init_viz() {
    console::log_1(&JsValue::from_str("Hello from Rust Viz Module!"));
}
