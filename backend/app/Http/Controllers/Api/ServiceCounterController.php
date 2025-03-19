<?php

namespace App\Http\Controllers\API;

use App\Models\ServiceCounter;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ServiceCounterController extends Controller
{
    
    public function index()
    {
        return response()->json(ServiceCounter::with('service')->get());
    }
    
    public function show($id)
    {
        $counter = ServiceCounter::with('service')->findOrFail($id);
        return response()->json($counter);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'counter_number' => 'required|integer|min:1|max:12',
            'service_id' => 'required|exists:services,id',
            'assigned_staff' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive,maintenance'
        ]);
        
        // Validate counter_number and service_id combinations
        $this->validateCounterService($validated['counter_number'], $validated['service_id']);
        
        $counter = ServiceCounter::create($validated);
        return response()->json($counter, 201);
    }
    
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'counter_number' => 'required|integer|min:1|max:12',
            'service_id' => 'required|exists:services,id',
            'assigned_staff' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive,maintenance'
        ]);
        
        // Validate counter_number and service_id combinations
        $this->validateCounterService($validated['counter_number'], $validated['service_id']);
        
        $counter = ServiceCounter::findOrFail($id);
        $counter->update($validated);
        
        return response()->json($counter);
    }
    
    public function destroy($id)
    {
        $counter = ServiceCounter::findOrFail($id);
        $counter->delete();
        
        return response()->json(null, 204);
    }
    
    private function validateCounterService($counterNumber, $serviceId)
    {
        $service = Service::findOrFail($serviceId);
        
        if ($counterNumber >= 1 && $counterNumber <= 3) {
            // Counter 1-3 can only be LA (service_id = 1)
            if ($serviceId != 1) {
                abort(422, 'Counters 1-3 can only provide Legal Assistance (LA) services.');
            }
        } elseif ($counterNumber >= 4 && $counterNumber <= 7) {
            // Counter 4-7 can be BM, DH, I, A, or G (service_id = 2-6)
            if ($serviceId < 2 || $serviceId > 6) {
                abort(422, 'Counters 4-7 can only provide BM, DH, I, A, or G services.');
            }
        } elseif ($counterNumber >= 8 && $counterNumber <= 10) {
            // Counter 8-10 can be FA, S, or L (service_id = 7-9)
            if ($serviceId < 7 || $serviceId > 9) {
                abort(422, 'Counters 8-10 can only provide FA, S, or L services.');
            }
        } elseif ($counterNumber == 11 || $counterNumber == 12) {
            // Counter 11-12 can be PIF or O (service_id = 10-11)
            if ($serviceId < 10 || $serviceId > 11) {
                abort(422, 'Counters 11-12 can only provide PIF or O services.');
            }
        }
        
        return true;
    }
    
    public function  getCountersByService($serviceId)
    {
        $counters = ServiceCounter::where('service_id', $serviceId)
                                 ->with('service')
                                 ->get();
                                 
        return response()->json($counters);
    }
    

public function updateStatus(Request $request, $id)
{
    $validated = $request->validate([
        'status' => 'required|in:active,inactive,maintenance'
    ]);
    
    $counter = ServiceCounter::findOrFail($id);
    $counter->status = $validated['status'];
    $counter->save();
    
    return response()->json($counter);
}

public function assignStaff(Request $request, $id)
{
    $validated = $request->validate([
        'assigned_staff' => 'required|string|max:100'
    ]);
    
    $counter = ServiceCounter::findOrFail($id);
    $counter->assigned_staff = $validated['assigned_staff'];
    $counter->save();
    
    return response()->json($counter);
}

public function getByCounterNumber($counterNumber)
{
    $counter = ServiceCounter::where('counter_number', $counterNumber)
                           ->with('service')
                           ->first();
                           
    if (!$counter) {
        return response()->json(['message' => 'Counter not found'], 404);
    }
    
    return response()->json($counter);
}

/*public function getCounterStatistics()
{
    $stats = [
        'total_counters' => ServiceCounter::count(),
        'active_counters' => ServiceCounter::where('status', 'active')->count(),
        'inactive_counters' => ServiceCounter::where('status', 'inactive')->count(),
        'maintenance_counters' => ServiceCounter::where('status', 'maintenance')->count(),
        'counters_by_service' => []
    ];
    
    $services = Service::all();
    foreach ($services as $service) {
        $stats['counters_by_service'][] = [
            'service' => $service->abbreviation,
            'description' => $service->description,
            'counter_count' => ServiceCounter::where('service_id', $service->id)->count()
        ];
    }
    
    return response()->json($stats);
}
/*public function getAvailableCounters()
{
    $counters = ServiceCounter::where('status', 'active')->get();
    return response()->json($counters);
}
    
}*/
}