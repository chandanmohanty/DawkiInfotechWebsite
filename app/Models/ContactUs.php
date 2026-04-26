<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'contactus';

    /**
     * Mass-assignable attributes (fields written from the contact form).
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'help_type',
        'message',
        'ip_address',
        'user_agent',
        'status',
    ];

    /**
     * Default attributes for new records.
     */
    protected $attributes = [
        'status' => 'new',
    ];
}
