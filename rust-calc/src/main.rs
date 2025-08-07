use wasm_bindgen::prelude::*;
use meval;

#[wasm_bindgen]
pub fn eval_expr(expr: &str) -> String {
    match meval::eval_str(expr) {
        Ok(result) => result.to_string(),
        Err(_) => "Write a valid expression man".to_string(),
    }
}
