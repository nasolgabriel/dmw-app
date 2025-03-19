<?php

namespace App\Http\Controllers\API;

use App\Models\Service;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::all());
    }
    
    public function show($id)
    {
        $service = Service::findOrFail($id);
        return response()->json($service);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'abbreviation' => 'required|max:5|unique:services',
            'description' => 'required|max:255'
        ]);
        
        $service = Service::create($validated);
        return response()->json($service, 201);
    }
    
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'abbreviation' => 'required|max:5|unique:services,abbreviation,'.$id,
            'description' => 'required|max:255'
        ]);
        
        $service = Service::findOrFail($id);
        $service->update($validated);
        
        return response()->json($service);
    }
    
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        
        return response()->json(null, 204);
    }
}