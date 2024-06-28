class ApiResponse {
    constructor( statusCode,message="Success",data){
        this.data = data,
        this.statusCode = statusCode,
        this.success = statusCode < 400,
        this.message = message
    }
}
export {ApiResponse}